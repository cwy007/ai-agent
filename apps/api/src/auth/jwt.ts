import { SignJWT, jwtVerify } from 'jose'
import { uuidv7 } from 'uuidv7'
import type {
  AccessTokenClaims,
  RefreshTokenClaims,
  SessionContext,
} from './types.ts'

// 这个文件里封装的 JWT 签发和验证逻辑，主要是为了在 Cloudflare Worker 环境下使用 jose 库时，避免重复编码/解码 secret 的问题。
// jose 库在签发和验证 JWT 时，要求 secret 是 Uint8Array 类型，而不是 string 类型。
// 所以我们在这里统一把 string 类型的 secret 转换为 Uint8Array 类型，避免在每次签发和验证时都进行转换，提升性能。
const encoder = new TextEncoder()

// 将 string 类型的 secret 转换为 Uint8Array 类型。
function toSecret(secret: string): Uint8Array {
  return encoder.encode(secret)
}

export async function signAccessToken(params: {
  claims: AccessTokenClaims
  secret: string
  ttlSec: number
}): Promise<string> {
  const nowSec = Math.floor(Date.now() / 1000) // 计算当前时间的秒数

  // access token 只带请求链路真正需要的最小身份信息，避免把会话状态塞进无状态令牌里。
  return new SignJWT({
    sid: params.claims.sid,
    app: params.claims.app,
    roles: params.claims.roles,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(params.claims.sub)
    .setIssuedAt(nowSec)
    .setExpirationTime(nowSec + params.ttlSec)
    .sign(toSecret(params.secret))
}

export async function signRefreshToken(params: {
  claims: Omit<RefreshTokenClaims, 'jti'>
  secret: string
  ttlSec: number
}): Promise<{
  token: string
  jti: string
}> {
  const nowSec = Math.floor(Date.now() / 1000)
  const jti = uuidv7()

  // refresh token 额外携带 jti，是为了把每一次续签都变成可追踪、可撤销的一条状态记录。
  const token = await new SignJWT({
    sid: params.claims.sid,
    app: params.claims.app,
    jti,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(params.claims.sub)
    .setIssuedAt(nowSec)
    .setExpirationTime(nowSec + params.ttlSec)
    .sign(toSecret(params.secret))

  return { token, jti }
}

export async function verifyRefreshToken(params: {
  token: string
  secret: string
}): Promise<RefreshTokenClaims> {
  const { payload } = await jwtVerify(params.token, toSecret(params.secret), {
    algorithms: ['HS256'],
  })

  const sid = payload.sid
  const app = payload.app
  const jti = payload.jti
  const sub = payload.sub

  if (
    typeof sid !== 'string' ||
    typeof app !== 'string' ||
    typeof jti !== 'string' ||
    typeof sub !== 'string' ||
    app !== 'admin'
  ) {
    throw new Error('Invalid refresh token claims')
  }

  return {
    sid,
    app: 'admin',
    jti,
    sub,
  }
}

export async function issueAdminTokenPair(params: {
  session: SessionContext
  accessSecret: string
  refreshSecret: string
  accessTtlSec: number
  refreshTtlSec: number
}): Promise<{
  accessToken: string
  refreshToken: string
  refreshJti: string
}> {
  const accessToken = await signAccessToken({
    claims: {
      sub: params.session.userId,
      sid: params.session.sessionId,
      app: params.session.app,
      roles: params.session.roles,
    },
    secret: params.accessSecret,
    ttlSec: params.accessTtlSec,
  })

  const refresh = await signRefreshToken({
    claims: {
      sub: params.session.userId,
      sid: params.session.sessionId,
      app: params.session.app,
    },
    secret: params.refreshSecret,
    ttlSec: params.refreshTtlSec,
  })

  return {
    accessToken,
    refreshToken: refresh.token,
    // jti 是什么的缩写？
    // jti 是 "JWT ID" 的缩写，是 JWT 的一个标准声明，用于唯一标识一个 JWT。
    // 它的作用是防止 JWT 被重放攻击，即同一个 JWT 被多次使用。
    // 通过在每个 JWT 中包含一个唯一的 jti，服务器可以记录已经使用过的 jti，从而拒绝重复使用的 JWT。
    refreshJti: refresh.jti,
  }
}