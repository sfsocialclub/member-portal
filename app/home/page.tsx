"use client";
import { UserQRCode } from "./components/UserQRCode";
import { WelcomeMessage } from "./components/WelcomeMessage";

export default function HomePage() {

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <WelcomeMessage />
      <UserQRCode/>
    </div>
  );
}
