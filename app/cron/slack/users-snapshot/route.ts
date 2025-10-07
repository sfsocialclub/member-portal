import type { NextRequest } from "next/server";
import { runSlackUsersSnapshot } from "@/lib/slack/runSnapshot";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const res = await runSlackUsersSnapshot({ limit: 200, softDeadlineMs: 52_000 });
  const status = res.ok ? 200 : (res.error?.startsWith("rate-limited") ? 429 : 500);
  return Response.json(res, { status });
}