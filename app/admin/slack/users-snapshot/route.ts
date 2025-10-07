import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, SFSCSession } from "@/lib/auth/authOptions";
import { runSlackUsersSnapshot } from "@/lib/slack/runSnapshot";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions) as SFSCSession;
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 });
  }
  const res = await runSlackUsersSnapshot({ limit: 200, softDeadlineMs: 52_000 });
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}