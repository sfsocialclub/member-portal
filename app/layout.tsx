"use client";

import { Provider } from "react-redux";
import { NavLinks } from "./components/global/NavLinks";
import "./globals.css";
import { store } from "@/lib/store";
import Template from "./template";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" className="font-morandi">
      <body className="bg-base-200 flex flex-col items-center h-screen w-full p-4">
        <Provider store={store}>
          <NavLinks />
          <main className="flex flex-col items-center justify-center h-screen w-full p-4 gap-y-2">
            <Template>{children}</Template>
          </main>
        </Provider>
      </body>
    </html>
  );
}
