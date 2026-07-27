// jose js 包中，claim 对应中文的词语是什么
// claim 对应中文的词语是 "声明"，声明项 或 "主张"。在 JWT（JSON Web Token）中，
// claim 是指在 token 中包含的关于实体（通常是用户）和其他数据的声明。
// claim 可以包含各种信息，例如用户的身份、权限、过期时间等。

export interface AccessTokenClaims {
  sub: string // userId
  sid: string // sessionId
  app: string // 'web' | 'admin'
  roles: string[] // user roles
}

export interface RefreshTokenClaims {
  sub: string // userId
  sid: string // sessionId
  app: string // 'web' | 'admin'
  jti: string // refresh token id
}

export interface SessionContext {
  userId: string // sub
  sessionId: string // sid
  app: 'web' | 'admin' // app
  roles: string[] // user roles
}