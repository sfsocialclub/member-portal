import "./globals.css";

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
      <body>
        <main className="bg-base-200 flex items-center justify-center h-screen w-full p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
