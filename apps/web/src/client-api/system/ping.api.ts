import type { ApiResponse, PingRequest, PingResponse } from '@repo/contracts'
import { http } from '@/http'

export function postClientPing(payload: PingRequest) {
  return http.post<PingRequest, PingResponse>('/rpc/system/ping', payload) as Promise<ApiResponse<PingResponse>>
}