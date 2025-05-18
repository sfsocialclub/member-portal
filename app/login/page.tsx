"use client"
import { useAppDispatch } from "@/lib/hooks";
import Cookies from 'js-cookie';
import { useState } from "react";
import { authApi } from "../../lib/auth/authApi";
import { authSlice } from "../../lib/auth/authSlice";
import { useRouterWithOptimisticPathname } from "../hooks/useOptimisticRouter";
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouterWithOptimisticPathname();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>("");
  const [login] = authApi.useLoginMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    login({ email, password })
      .then(({ data, error }) => {
        if (data) {
          dispatch(authSlice.actions.setRole(data.role));
          dispatch(authSlice.actions.setUserId(data.userId))

          router.push('/')
        } else if (error) { throw error }
      }).catch((error) => {
        console.log(error)
        // TODO: Handle error state UI
      })
  }

  const handleSignupNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    router.push("/signup");
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Image className={'mx-auto'} src="/logo.png" alt={'SF Social Club'} width={150} height={150}/>
        <div className="w-full max-w-2xl bg-base-100 flex flex-col p-6 rounded-2xl">
          <div className="w-full flex items-center justify-center">
            <p className="text-4xl my-6 font-[Red_Hat_Display] font-extrabold text-accent">
              SF SOCIAL CLUB
            </p>
          </div>
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-2">
              <p className="text-xl font-semibold text-base-content font-[Red_Hat_Display]">Log In</p>
              <p className="text-base text-base-content">
                Enter your login credentials
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
            <input
              type="password"
              placeholder="password"
              className="input input-bordered w-full"
              required={true}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button className="btn" type="submit">
              Continue
            </button>
          </form>
        </div>
        <p className="ml-1 text-base-content">
          Don't have an account?{" "}
          <a onClick={handleSignupNavigation} className="link">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
