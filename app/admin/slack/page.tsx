import client from "@/lib/db";
import RunNowButton from "./run-now";

export const runtime = "nodejs";

const ACTIVE_FILTER = {
  $and: [
    { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
    { $or: [{ is_bot: { $exists: false } }, { is_bot: false }] },
    { $or: [{ is_app_user: { $exists: false } }, { is_app_user: false }] },
  ],
};

async function getStats() {
  const mongo = await client.connect();
  const db = mongo.db("db");
  const col = db.collection("slack_users");

  const [totalDocs, activeHumans, lastDoc] = await Promise.all([
    col.countDocuments({}),
    col.countDocuments(ACTIVE_FILTER),
    col.find().sort({ snapshot_at: -1 }).limit(1).project({ snapshot_at: 1, _id: 0 }).toArray(),
  ]);

  return {
    totalDocs,
    activeHumans,
    lastSnapshotAt: lastDoc[0]?.snapshot_at ?? null,
  };
}

export default async function AdminSlackPage() {

  const stats = await getStats();
  const last = stats.lastSnapshotAt ? new Date(stats.lastSnapshotAt).toLocaleString() : "—";

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Members Snapshot</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4 shadow-sm">
          <div className="text-sm text-gray-500">Active members</div>
          <div className="text-3xl font-semibold">{stats.activeHumans}</div>
        </div>
        <div className="rounded-2xl border p-4 shadow-sm">
          <div className="text-sm text-gray-500">Total records</div>
          <div className="text-3xl font-semibold">{stats.totalDocs}</div>
        </div>
        <div className="rounded-2xl border p-4 shadow-sm">
          <div className="text-sm text-gray-500">Last snapshot</div>
          <div className="text-lg">{last}</div>
        </div>
      </div>

      <RunNowButton />

      <p className="text-sm text-gray-500">The cron also runs daily and updates the same collection.</p>
    </div>
  );
}