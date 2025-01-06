"use client";
import { useAppSelector } from "@/lib/hooks";
import { WelcomeMessage } from "./WelcomeMessage";
import AdminPage from "../components/AdminPage";

export default function HomePage() {
  const role = useAppSelector((state) => state.auth.role);

  if (role === "admin") {
    return <AdminPage />;
  }

  return (
    <div className="flex flex-col items-center">
      <WelcomeMessage />
    </div>
  );
}
