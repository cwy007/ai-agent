import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Separator } from "@repo/ui/separator";
import { TailwindDemo } from "@repo/ui/tailwind-demo";
import { getAdminServerEnv } from "../src/env.server";
import { AdminEnvBadge } from "../src/admin-env-badge";

export default function Home() {
  const env = getAdminServerEnv();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment overview</CardTitle>
        <CardDescription>
          The admin app reads private server variables and public browser variables separately.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p>APP_ENV</p>
            <p>{env.APP_ENV}</p>
          </div>
          <div>
            <p>API_BASE_URL</p>
            <p>{env.API_BASE_URL}</p>
          </div>
        </div>
        <AdminEnvBadge />
      </CardContent>
    </Card>
  );
}
