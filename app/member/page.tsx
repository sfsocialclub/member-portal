'use client';
import { WelcomeMessage } from "../components/WelcomeMessage";

export default function MemberPage() {
  return <div className="flex flex-col items-center">
    <h1 className="block">Member page</h1>
    <WelcomeMessage/>
  </div>;
}
