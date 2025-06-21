"use client";
import { UserQRCode } from "./components/UserQRCode";

export default function QrPage() {

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <UserQRCode />
    </div>
  );
}
