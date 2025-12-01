import client from "../db";

const CACHE_KEY = 'users_list';

export async function getCachedSlackUsers() {
  const db = (await client.connect()).db(process.env.MONGODB_DB); // use shared DB
  const doc = await db.collection('slack_cache').findOne({ key: CACHE_KEY });
  return doc?.data ?? null;
}

export async function setCachedSlackUsers(data: any) {
  const db = (await client.connect()).db(process.env.MONGODB_DB);
  await db.collection('slack_cache').updateOne(
    { key: CACHE_KEY },
    { $set: { data, updatedAt: new Date() } },
    { upsert: true }
  );
}

export async function clearSlackUserCache() {
  const db = (await client.connect()).db(process.env.MONGODB_DB);
  await db.collection('slack_cache').deleteOne({ key: CACHE_KEY });
}