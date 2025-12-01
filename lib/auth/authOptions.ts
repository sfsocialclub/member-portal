import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions, Session } from "next-auth";
import SlackProvider from "next-auth/providers/slack";
import client from "@/lib/db";
import jwt from 'jsonwebtoken';
import { WebClient } from "@slack/web-api";
import { encode } from "next-auth/jwt";

export interface SFSCSession extends Session {
    user: SessionUser;
    apiToken: string;
}export type SessionUser = Session['user'] & {
    id: string; // User ID in mongoDB
    slackId: string; // Slack ID
    isAdmin?: boolean;
};
export type Token = {
    slackId: string;
    sub: string; // User ID in mongoDB
    isAdmin?: boolean;
};


export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(client, {
        databaseName: process.env.MONGODB_DB
    }),
    providers: [
        SlackProvider({
            wellKnown: undefined,
            authorization: {
                url: `https://sf-socialclub.slack.com/oauth?client_id=${process.env.SLACK_CLIENT_ID}`,
                params: {
                    scope: '',
                    user_scope: "users:read,users:read.email",
                    granular_bot_scope: 1,
                    single_channel: 0,
                    install_redirect: '',
                    tracked: 1,
                    openid_connect: 1,
                }
            },
            token: "https://slack.com/api/openid.connect.token",
            //@ts-expect-error - oauth is a valid type
            type: "oauth",
            issuer: "https://slack.com",
            jwks_endpoint: "https://slack.com/openid/connect/keys",
            clientId: process.env.SLACK_CLIENT_ID as string,
            clientSecret: process.env.SLACK_CLIENT_SECRET as string,
            async profile(profile, tokens) {
                console.log('profile args', JSON.stringify({ profile, tokens }, null, 2))

                // Initialize isAdmin
                let isAdmin = false;

                if (tokens.access_token) {
                    // Use the access token to make a request to the Slack API
                    try {
                        const slackClient = new WebClient(tokens.access_token);
                        const result = await slackClient.users.info({
                            user: profile.sub
                        });

                        console.log(`Slack User Result = ${JSON.stringify({ result }, null, 2)}`)

                        if (result.ok && result.user && !Array.isArray(result.user)) {
                            isAdmin = result.user.is_admin || false;
                        }

                        return {
                            id: profile.sub,
                            slackId: profile.sub,
                            name: result.user?.profile?.real_name,
                            email: result.user?.profile?.email,
                            image: result.user?.profile?.["image_512"],
                            isAdmin: isAdmin,
                            emailVerified: result.user?.is_email_confirmed
                        }
                    } catch (error) {
                        console.error('Slack API error:', JSON.stringify({ error }, null, 2));
                    }
                }

                return {
                    id: profile.sub,
                    slackId: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    isAdmin: isAdmin,
                    emailVerified: null
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            if (account?.providerAccountId) {
                token.slackId = account.providerAccountId;
            }
            if (user) {
                // @ts-expect-error
                token.isAdmin = user?.isAdmin
            }

            console.log(`jwt = ${JSON.stringify({ token }, null, 2)}`)
            return token
        },
        async session(params) {
            const session = params.session as SFSCSession;
            const token = params.token as Token;
            session.user.slackId = token.slackId;
            session.user.id = token.sub;
            session.user.isAdmin = token.isAdmin;
            session.apiToken = jwt.sign(token, process.env.NEXTAUTH_SECRET!, {
                algorithm: "HS256",
            })
            console.log(`Session = ${JSON.stringify({ session }, null, 2)}`)

            return { ...session }
        },
    },
    events: {
        async signIn({ user, profile, account }) {
            // update db user if user exists
            await authOptions.adapter?.updateUser?.({
                id: user.id,
                name: profile?.name,
                email: profile?.email,
                image: profile?.image,
                // @ts-expect-error
                isAdmin: profile?.isAdmin
            })

            if (account?.access_token && account?.id_token) {
                // update account in db
                await client.connect()
                const db = client.db(process.env.MONGODB_DB) // or your DB name
                await db.collection("accounts").updateOne({
                    provider: "slack",
                    providerAccountId: account?.providerAccountId
                }, {
                    $set: {
                        access_token: account.access_token,
                        id_token: account.id_token
                    }
                })
            } else {
                console.log(`Could not find account for user id: ${user.id}`)
            }
        },
    },
    jwt: {
        // ✅ Custom encode to return plain signed JWT
        encode: async ({ token, secret }) => {
            //@ts-expect-error - token type is valid
            return jwt.sign(token, secret, {
                algorithm: "HS256",
            })
        },

        // ✅ Custom decode to verify and return decoded token
        //@ts-expect-error - token type is valid
        decode: async ({ token, secret }) => {
            try {
                return jwt.verify(token!, secret, {
                    algorithms: ["HS256"],
                })
            } catch (err) {
                console.error("JWT Decode failed:", err)
                return null
            }
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
}
