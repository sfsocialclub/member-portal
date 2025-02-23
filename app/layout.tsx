import "./globals.css";
import { Providers } from "./providers";
import ProtectedRouteProvider from "./template";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="sfsocialclub" className="font-morandi">
      <body className="bg-base-100 w-full h-screen">
          <main className="h-full w-full pt-[64px]">
            <Providers><ProtectedRouteProvider>{children}</ProtectedRouteProvider></Providers>
          </main>
      </body>
    </html>
  );
}
