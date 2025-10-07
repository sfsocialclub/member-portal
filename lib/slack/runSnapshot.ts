import client from "@/lib/db";
import { WebClient, WebAPICallResult } from "@slack/web-api";

export type SnapshotResult = {
    ok: boolean;
    totalFetched: number;
    totalUpserts: number;
    when: string;
    error?: string;
};

export type RunOpts = {
    limit?: number;            // page size (200 recommended)
    softDeadlineMs?: number;   // stop before platform hard timeout
};

type SlackUser = {
    id: string;
    deleted?: boolean;
    is_bot?: boolean;
    is_app_user?: boolean;
    profile?: { email?: string; real_name?: string };
    [k: string]: any;
};

function isActiveHuman(u: SlackUser) {
    return !u.deleted && !u.is_bot && !u.is_app_user;
}

export async function runSlackUsersSnapshot({ limit = 200, softDeadlineMs = 52_000 }: RunOpts = {}): Promise<SnapshotResult> {
    const started = Date.now();
    const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
    const mongo = await client.connect();
    const db = mongo.db("db");
    const col = db.collection("slack_users");

    await col.createIndex({ id: 1 }, { unique: true });
    await col.createIndex({ "profile.email": 1 }, { sparse: true });

    let cursor: string | undefined;
    let totalFetched = 0;
    let totalUpserts = 0;

    for (; ;) {
        if (Date.now() - started > softDeadlineMs) {
            return { ok: false, error: "soft-deadline-reached", totalFetched, totalUpserts, when: new Date().toISOString() };
        }

        try {
            const res = await slack.users.list({ limit, cursor }) as WebAPICallResult & {
                ok?: boolean;
                error?: string;
                members?: SlackUser[];
                response_metadata?: { next_cursor?: string };
            };

            if (!res.ok) {
                return { ok: false, error: res.error ?? "slack-error", totalFetched, totalUpserts, when: new Date().toISOString() };
            }

            const members = res.members ?? [];
            totalFetched += members.length;

            const filtered = members.filter(isActiveHuman);
            if (filtered.length) {
                const ops = filtered.map(u => ({
                    updateOne: {
                        filter: { id: u.id },
                        update: {
                            $set: {
                                ...u,
                                snapshot_at: new Date(),
                                deactivated: !!u.deleted,
                            },
                        },
                        upsert: true,
                    },
                }));
                const r = await col.bulkWrite(ops, { ordered: false });
                totalUpserts += (r.upsertedCount ?? 0) + (r.modifiedCount ?? 0) + (r.matchedCount ?? 0);
            }

            const next = res.response_metadata?.next_cursor?.trim();
            if (!next) break;
            cursor = next;

            // small pacing to reduce 429 risk
            await new Promise(r => setTimeout(r, 150));
        } catch (err: any) {
            const retryAfterSec = Number(
                err?.data?.retry_after ??
                err?.headers?.["retry-after"] ??
                err?.retryAfter ?? 0
            );
            if ((err?.status === 429 || retryAfterSec > 0)) {
                const ms = Math.max(1000, retryAfterSec * 1000);
                if (Date.now() - started + ms > softDeadlineMs) {
                    return { ok: false, error: `rate-limited (${retryAfterSec}s)`, totalFetched, totalUpserts, when: new Date().toISOString() };
                }
                await new Promise(r => setTimeout(r, ms));
                continue;
            }
            return { ok: false, error: String(err?.message ?? err), totalFetched, totalUpserts, when: new Date().toISOString() };
        }
    }

    return { ok: true, totalFetched, totalUpserts, when: new Date().toISOString() };
}