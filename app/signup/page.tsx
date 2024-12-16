"use client";

import { useAppDispatch } from "@/lib/hooks";
import { useSignupMutation } from "@/lib/auth/authApi";
import { authSlice } from "@/lib/auth/authSlice";
import Cookies from "js-cookie";
import { useState } from "react";
import { useRouterWithOptimisticPathname } from "../hooks/useOptimisticRouter";

export default function LoginPage() {
  const router = useRouterWithOptimisticPathname();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [retypePassword, setRetypePassword] = useState<string>("");
  const dispatch = useAppDispatch();

  const [signup] = useSignupMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (password !== retypePassword) {
      // TODO: Handle this in the UI
      alert("Passwords do not match, please try again");
      return;
    }

    signup({email, password})
    .then(({data, error}) => {
      if(data?.access_token) {
        Cookies.set('access_token', data.access_token)
        dispatch(authSlice.actions.setRole(data.role));
        dispatch(authSlice.actions.setUserId(data.userId))
        
        router.push('/')
      } else if (error) { throw error }
    }).catch((error) => {
      console.log(error)
      // TODO: Handle error state UI
    })
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
