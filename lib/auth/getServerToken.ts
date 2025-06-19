import { Token } from "./authOptions";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";


export async function getServerToken(req: NextRequest) {
  return await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    //@ts-expect-error - token type is valid
    decode: async ({ token, secret }) => {
      try {
        return jwt.verify(token!, secret, {
          algorithms: ["HS256"],
        });
      } catch (err) {
        console.error("JWT Decode failed:", err);
        return null;
      }
    },
  }) as Token;
}
