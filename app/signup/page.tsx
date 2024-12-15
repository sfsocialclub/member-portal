"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "@/lib/services/account";
import Link from "next/link";
import { useRouterWithOptimisticPathname } from "../hooks/useOptimisticRouter";

export default function LoginPage() {
  const router = useRouterWithOptimisticPathname();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [retypePassword, setRetypePassword] = useState<string>("");

  const [signup] = useSignupMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email || !password) {
      console.error("Blank input passed in");
      return;
    }

    if (password !== retypePassword) {
      // TODO: Handle this in the UI
      alert("Passwords do not match, please try again");
      return;
    }

    const { data, error } = await signup({ email, password });

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

  const handleLoginNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    router.push("/login");
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div className="w-full max-w-2xl bg-base-100 flex flex-col p-8 rounded-2xl">
        <div className="w-full h-32 flex items-center justify-center">
          <p className="text-4xl text-base-content">Join SF Social Club!</p>
        </div>
        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email"
            className="input input-bordered w-full"
            required={true}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            placeholder="password"
            className="input input-bordered w-full"
            required={true}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <input
            type="password"
            placeholder="retype password"
            className="input input-bordered w-full"
            required={true}
            onChange={(e) => setRetypePassword(e.target.value)}
            value={retypePassword}
          />
          <button className="btn" type="submit">
            Create account
          </button>
        </form>
      </div>
      <p className="ml-1 text-base-content">
        Already have an account?{" "}
        <a onClick={handleLoginNavigation} className="link">
          Log in
        </a>
      </p>
    </div>
  );
}
