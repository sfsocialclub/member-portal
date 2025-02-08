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
      <body className="bg-base-100 h-screen w-full">
          <main className="h-screen w-full">
            <Providers><ProtectedRouteProvider>{children}</ProtectedRouteProvider></Providers>
          </main>
      </body>
    </html>
  );
}
