"use client";
import { UserQRCode } from "./components/UserQRCode";
import { WelcomeMessage } from "./components/WelcomeMessage";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <WelcomeMessage />
      <UserQRCode/>
    </div>
  );
}
