"use client";

import { WelcomeMessage } from "../components/WelcomeMessage";

export default function AdminPage() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="block">Admin page</h1>
      <WelcomeMessage />
    </div>
  );
}
