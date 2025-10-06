import { authOptions } from "@/lib/auth/authOptions";
import '@fontsource-variable/dm-sans';
import '@fontsource/red-hat-display/700.css';
import { getServerSession } from "next-auth/next";
import "./globals.css";
import { OnboardingWrapper } from "./OnboardingWrapper";
import { Providers } from "./providers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" data-theme="sfsocialclub" className="bg-base-200 font-[Dm_Sans_Variable] h-full">
      <head>
        <meta name="apple-mobile-web-app-title" content="SFSC" />
        <link rel="apple-touch-icon" href="/maskable_icon_x192.png" />
      </head>
      <body className="h-full w-full">
        <main className="h-full w-full">
          <Providers session={session}>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
