"use client"
import { useAppDispatch } from "@/lib/hooks";
import Cookies from 'js-cookie';
import { useState } from "react";
import { authApi } from "../../lib/auth/authApi";
import { authSlice } from "../../lib/auth/authSlice";
import { useRouterWithOptimisticPathname } from "../hooks/useOptimisticRouter";

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
        if (data?.access_token) {
          Cookies.set('access_token', data.access_token)
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
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <div className="w-full max-w-2xl bg-base-100 flex flex-col p-8 rounded-2xl">
          <div className="w-full h-32 flex items-center justify-center">
            <p className="text-4xl text-base-content">
              Welcome to SF Social Club!
            </p>
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
