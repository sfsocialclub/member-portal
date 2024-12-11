import { NavLinks } from "./components/global/NavLinks";
import "./globals.css";
import Template from "./template";

export const metadata = {
  // TODO: Add in more metadata, twitter, insta, SEO etc
  title: "SF Social Club Member Portal",
  description: "SF Social Club Member Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" className="font-morandi">
      <body className="bg-base-200 flex flex-col items-center h-screen w-full p-4">
          <NavLinks/>
          <main className="flex flex-col items-center justify-center h-screen w-full p-4 gap-y-2">
            <Template>{children}</Template>
          </main>
      </body>
    </html>
  );
}
