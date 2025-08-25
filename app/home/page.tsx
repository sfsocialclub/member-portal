"use client";
import { useRouter } from "next/navigation";
import { UserQRCode } from "../qr/components/UserQRCode";
import { WelcomeMessage } from "../qr/components/WelcomeMessage";
import { signOut } from "next-auth/react";
import { HostedEventsCard } from "./components/HostedEventsCard";

export default function HomePage() {
  const router = useRouter();

  const handleLogoutClick = () => {
    signOut().then(() => { router.refresh() })
  };

  return (
    <div className="flex flex-col justify-center flex-1 max-h-[calc(100%_-_64px)] gap-y-12 w-full max-w-md">
      <WelcomeMessage />
      <HostedEventsCard/>
      <button onClick={handleLogoutClick} className="mt-10 btn btn-outline btn-secondary w-full">Log out</button>
    </div>
  );
}
