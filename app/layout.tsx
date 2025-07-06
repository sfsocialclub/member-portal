import { authOptions } from "@/lib/auth/authOptions";
import '@fontsource/dm-sans';
import '@fontsource/red-hat-display/700.css';
import { getServerSession } from "next-auth/next";
import "./globals.css";
import { Providers } from "./providers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" data-theme="sfsocialclub" className="bg-base-200 font-[Dm_Sans] h-full">
      <body className="h-full w-full">
          <main className="h-full w-full">
            <Providers session={session}>{children}</Providers>
          </main>
      </body>
    </html>
  );
}
