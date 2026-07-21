import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

import type { AppType } from "@repo/api";
import { BizCode, type ApiResponse, type PingRequest, type PingResponse } from "@repo/contracts";
import { hc, type InferResponseType } from "hono/client";

const apiBaseUrl = process.env.API_BASE_URL ?? "http://127.0.0.1:8787";

type PingRpcResponse = InferResponseType<
  ReturnType<typeof hc<AppType>>["rpc"]["system"]["ping"]["$post"]
>;

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

async function getPingResponse(): Promise<PingRpcResponse> {
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

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const currentName = normalizeName(resolvedSearchParams?.name);
  const pingTest = await getPingResponse();
  const requestBody = JSON.stringify(rpcPayload, null, 2);
  const responseBody = JSON.stringify(pingTest, null, 2);
  const resultVariant = pingTest.ok ? "success" : "error";
  const resultSummary = pingTest.ok ? "ok=true" : `code=${pingTest.error.code}`;

  return (
    <section className="py-10">
      <Card className="overflow-hidden border border-border bg-background shadow-soft">
        <CardHeader className="space-y-3 border-b border-border/80 bg-muted/20">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black">
              RPC validation
            </p>
            <h2 className="text-2xl font-semibold text-black">
              Shared request and response contract
            </h2>
            <CardDescription>
              直接在页面内修改请求参数并重新触发 `POST
              /rpc/system/ping`，同时观察状态、耗时和响应体。
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline">POST /rpc/system/ping</Badge>
            <Badge variant={resultVariant}>{resultSummary}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <form className="grid gap-4 rounded-2xl border border-border bg-muted/30 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="grid gap-2">
              <Label htmlFor="rpc-name">Ping name</Label>
              <Input
                id="rpc-name"
                name="name"
                defaultValue={currentName}
                placeholder="输入 ping 名称，例如 web"
              />
            </div>
            <Button type="submit">重新测试</Button>
          </form>

          <div className="grid gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-sm text-black md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-black/80">
                API Base URL
              </p>
              <p className="mt-2 break-all font-medium text-black">{apiBaseUrl}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-black/80">
                Request ID
              </p>
              <p className="mt-2 break-all font-medium text-black">
                {pingTest.meta.requestId}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-black/80">
                Timestamp
              </p>
              <p className="mt-2 break-all font-medium text-black">
                {pingTest.meta.timestamp}
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <p className="text-sm font-medium text-black">Request</p>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all text-xs leading-6 text-black">
                {requestBody}
              </pre>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <p className="text-sm font-medium text-black">Response</p>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all text-xs leading-6 text-black">
                {responseBody}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
