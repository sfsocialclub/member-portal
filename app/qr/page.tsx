"use client";
import { UserQRCode } from "./components/UserQRCode";

export default function QrPage() {

  return (
    <div className="flex flex-col items-center justify-center h-full max-h-[calc(100%_-_64px)]">
      <UserQRCode />
      <a href="https://docs.google.com/forms/d/1jH_4hPQjxjp8oF7mmOflAqBEMAgFbcis6ZUbXLrC8B4/viewform?edit_requested=true" target="_blank" className="mt-10 btn btn-ghost btn-primary w-full text-primary hover:text-white text-sm">Questions? Submit your feedback</a>
    </div>
  );
}
