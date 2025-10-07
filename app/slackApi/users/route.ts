import { authOptions, SFSCSession } from "@/lib/auth/authOptions";
import client from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions) as SFSCSession;
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const mongo = await client.connect();
  const db = mongo.db("db");
  const col = db.collection("slack_users");

  const users = await col.find({
    $and: [
      { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
      { $or: [{ is_bot: { $exists: false } }, { is_bot: false }] },
      { $or: [{ is_app_user: { $exists: false } }, { is_app_user: false }] }
    ]
  })
  .project({ _id: 0 })
  .toArray();

  const last = await col.find().sort({ snapshot_at: -1 }).limit(1).project({ snapshot_at: 1, _id: 0 }).toArray();

  return NextResponse.json({
    users,
    lastSnapshotAt: last[0]?.snapshot_at ?? null
  });
}