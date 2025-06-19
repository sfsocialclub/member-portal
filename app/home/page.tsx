"use client";
import { useRouter } from "next/navigation";
import { UserQRCode } from "./components/UserQRCode";
import { WelcomeMessage } from "./components/WelcomeMessage";
import { signOut } from "next-auth/react";

export default function HomePage() {
  const router = useRouter();

  const handleLogoutClick = () => {
    signOut().then(() => { router.refresh() })
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <WelcomeMessage />
      <UserQRCode />
      <button onClick={handleLogoutClick} className="mt-10 btn btn-outline btn-secondary w-full">Log out</button>
    </div>
  );
}
