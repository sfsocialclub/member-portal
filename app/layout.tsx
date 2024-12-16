import "./globals.css";
import { Providers } from "./providers";
import Template from "./template";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" className="font-morandi">
      <body className="bg-base-200 flex flex-col items-center h-screen w-full p-4">
          <main className="flex flex-col items-center justify-center h-screen w-full p-4 gap-y-2">
            <Providers><Template>{children}</Template></Providers>
          </main>
      </body>
    </html>
  );
}
