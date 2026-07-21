import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { getWebServerEnv } from "../src/env.server";
import { WebEnvBadge } from "../src/web-env-badge";

import type { AppType } from "@repo/api";
import { BizCode, type ApiResponse, type PingRequest, type PingResponse } from "@repo/contracts";
import { hc, type InferResponseType } from "hono/client";

const apiBaseUrl = process.env.API_BASE_URL ?? "http://127.0.0.1:8787";

type PingRpcResponse = InferResponseType<
  ReturnType<typeof hc<AppType>>["rpc"]["system"]["ping"]["$post"]
>;

type PingTestResult = {
  payload: PingRequest;
  response: PingRpcResponse;
  statusLabel: string;
  durationMs: number;
};

type HomeProps = {
  searchParams?: Promise<{
    name?: string | string[];
  }>;
};

function normalizeName(value: string | string[] | undefined): string {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const trimmedValue = rawValue?.trim();

  return trimmedValue && trimmedValue.length > 0 ? trimmedValue : "web";
}

const rpcPayload: PingRequest = { name: "web" };

async function getPingResponse(apiBaseUrl: string): Promise<PingRpcResponse> {
  const client = hc<AppType>(apiBaseUrl);

  try {
    const response = await client.rpc.system.ping.$post({
      json: rpcPayload,
    });

    return await response.json();
  } catch (error) {
    return {
      ok: false,
      error: {
        code: BizCode.SYSTEM_UPSTREAM_TIMEOUT,
        message: error instanceof Error ? error.message : "API request failed",
      },
      meta: {
        requestId: "unavailable",
        timestamp: new Date().toISOString(),
      },
    } satisfies ApiResponse<PingResponse>;
  }
}

// async function getPingResponse(apiBaseUrl: string): Promise<PingRpcResponse> {
//   const client = hc<AppType>(apiBaseUrl);
//   const response = await client.rpc.system.ping.$post({
//     json: rpcPayload,
//   });

//   return await response.json();
// }

export default async function Home() {
  const env = getWebServerEnv();
  const pingResult = await getPingResponse(env.API_BASE_URL);

  return (
    <section>
      <div>server {env.APP_ENV}</div>
      <div>{env.API_BASE_URL}</div>
      <WebEnvBadge />
    </section>
  );
}
