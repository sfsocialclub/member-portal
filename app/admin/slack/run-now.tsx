"use client";
import { useState } from "react";

export default function RunNowButton() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | { ok: boolean; totalFetched: number; totalUpserts: number; when: string; error?: string }>(null);

    async function runNow() {
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch("/admin/slack/users-snapshot", { method: "POST" });
            const json = await res.json();
            setResult(json);
        } catch (e: any) {
            setResult({ ok: false, totalFetched: 0, totalUpserts: 0, when: new Date().toISOString(), error: e?.message ?? String(e) });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-3">
            <button
                onClick={runNow}
                disabled={loading}
                className="rounded-2xl border px-4 py-2 shadow-sm hover:shadow disabled:opacity-60"
            >
                {loading ? "Running…" : "Run now"}
            </button>
            {result && (
                <div className={`rounded-2xl border p-4 ${result.ok ? "bg-green-50" : "bg-red-50"}`}>
                    <div className="font-medium">{result.ok ? "Snapshot complete" : "Snapshot failed"}</div>
                    <div className="text-sm">Fetched: {result.totalFetched} • Upserts: {result.totalUpserts}</div>
                    <div className="text-xs text-gray-600">{new Date(result.when).toLocaleString()}</div>
                    {result.error && <div className="text-xs text-red-700 mt-1">{result.error}</div>}
                </div>
            )}
        </div>
    );
}