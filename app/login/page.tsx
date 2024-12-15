"use client";

import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/lib/services/login";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>();

  const [login] = useLoginMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email) {
      console.error("Blank email passed in");
      return;
    }

    const { data, error } = await login(email);

    if (error) {
      console.error(error);
      // TODO: Handle error state UI
    }

    if (data?.accessToken) {
      Cookies.set("access_token", data.accessToken);
      Cookies.set("role", data.role); // UNSAFE, temporary solution to demo role saved in state
      router.push("/");
    }
  };

  return (
    <div className="w-full max-w-2xl bg-base-100 flex flex-col p-8 rounded-2xl">
      <div className="w-full h-32 flex items-center justify-center">
        <p className="text-4xl text-base-content">Welcome to SF Social Club!</p>
      </div>
      <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="w-full flex flex-col gap-2">
          <p className="text-3xl font-semibold text-base-content">Log in</p>
          <p className="text-base text-base-content">
            Enter your email and we'll send you a login code
          </p>
        </div>
        <input
          type="email"
          placeholder="email"
          className="input input-bordered w-full"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <button className="btn" type="submit">
          Continue
        </button>
      </form>
    </div>
  );
}
