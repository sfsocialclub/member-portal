"use client";
import { UserQRCode } from "./components/UserQRCode";

export default function QrPage() {

  return (
    <div className="flex flex-col items-center justify-center h-full max-h-[calc(100%_-_64px)]">
      <UserQRCode />
    </div>
  );
}
