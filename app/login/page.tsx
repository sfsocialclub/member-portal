"use client";

import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await axios
      .post(
        "http://127.0.0.1:5328/api/login",
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(({ data }) => {
        if (data.access_token) {
          Cookies.set("access_token", data.access_token);
          Cookies.set("role", data.role); // UNSAFE, temporary solution to demo role saved in state
          router.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
