import { authOptions, SFSCSession } from "@/lib/auth/authOptions";
import client from "@/lib/db";
import { getCachedSlackUsers, setCachedSlackUsers } from "@/lib/slack/slackCache";
import { WebClient } from '@slack/web-api';
import { getServerSession } from 'next-auth/next';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions) as SFSCSession;

  if (session.user.isAdmin === false) {
    return new Response(JSON.stringify({ error: 'Not authorized' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await client.connect()
  const db = client.db("db") // or your DB name
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

  try {
    const web = new WebClient(slackToken, {
      rejectRateLimitedCalls: true
    });
    const result = await web.users.list({});

    if (result.ok && result.members) {
      await setCachedSlackUsers(result.members)
      return new Response(JSON.stringify(result.members), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.warn('Slack API error', result.error);
  } catch (error) {
    console.error('Slack API error:', error);

    const cached = await getCachedSlackUsers();
    if (cached) return new Response(JSON.stringify(cached), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    return new Response(JSON.stringify({ error: 'Slack API unavailable and no cache found' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}