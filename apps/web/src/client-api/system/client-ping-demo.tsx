"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClientHealth } from "@/client-api/system/health.api";
import { postClientPing } from "@/client-api/system/ping.api";

const HEALTH_QUERY_KEY = ["system-health"];

export function ClientPingDemo() {
  const queryClient = useQueryClient();

  // 获取数据
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: HEALTH_QUERY_KEY,
    queryFn: getClientHealth,
  });

  // 发送请求
  const pingMutation = useMutation({
    mutationFn: () => postClientPing({ name: "client-web" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEY });
    },
  });

  return <div>{/* ...UI */}</div>;
}
