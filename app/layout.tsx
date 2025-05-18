import "./globals.css";
import { Providers } from "./providers";
import ProtectedRouteProvider from "./template";
import '@fontsource/dm-sans';
import '@fontsource/red-hat-display/700.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="sfsocialclub" className="font-[Dm_Sans]">
      <body className="bg-base-200 w-full h-screen">
          <main className="h-full w-full">
            <Providers>{children}</Providers>
          </main>
      </body>
    </html>
  );
}
