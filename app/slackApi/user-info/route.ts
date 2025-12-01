// pages/api/slack/user-info.ts
import { authOptions, SFSCSession } from "@/lib/auth/authOptions";
import client from "@/lib/db";
import { WebClient } from '@slack/web-api';
import { getServerSession } from 'next-auth/next';
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession<any, SFSCSession>(authOptions);

  if (!session?.user?.slackId) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await client.connect()
  const db = client.db(process.env.MONGODB_DB) // or your DB name
  const account = await db.collection("accounts").findOne({
    provider: "slack",
    providerAccountId: session?.user?.slackId,
  })

  if (!account) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const slackToken = account.access_token

  const userId = session?.user?.slackId;

  try {
    const web = new WebClient(slackToken);
    const result = await web.users.info({ user: userId });

    return new Response(JSON.stringify(result.user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },

    })

  } catch (error) {
    console.error('Slack API error:', error);
    return new Response(JSON.stringify({ error: 'Slack API failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
