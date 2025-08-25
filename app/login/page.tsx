"use client"
import { useAppSession } from "@/lib/hooks";
import { getProviders, signIn } from "next-auth/react";
import Image from 'next/image';
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [providers, setProviders] = useState<Awaited<ReturnType<typeof getProviders>>>(null);
  const session = useAppSession();

  useEffect(() => {
    getProviders().then((providers) => {
      setProviders(providers)
    });
  }, []);

  if(session) {
    <div>You should be redirected soon...</div>
  }

  return (
    <div className="h-full w-full flex items-center justify-center flex-1">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Image className={'mx-auto'} src="/logo.png" alt={'SF Social Club'} width={150} height={150} />
        <div className="w-full max-w-2xl bg-base-100 flex flex-col p-6 rounded-2xl">
          <div className="w-full flex items-center justify-center">
            <p className="text-4xl my-6 font-[Red_Hat_Display] font-extrabold text-accent">
              SF SOCIAL CLUB
            </p>
          </div>
          <div className="flex justify-center">
            {
              providers && Object.values(providers).map((provider) => {
                if (provider.name.toLowerCase() === 'slack') {
                  return (
                    <div key={provider.name}>
                      <button onClick={() => signIn(provider.id)} className="btn bg-[#622069] text-white border-[#591660]">
                        <svg aria-label="Slack logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g strokeLinecap="round" strokeWidth="78"><path stroke="#36c5f0" d="m110 207h97m0-97h.1v-.1"></path><path stroke="#2eb67d" d="m305 110v97m97 0v.1h.1"></path><path stroke="#ecb22e" d="m402 305h-97m0 97h-.1v.1"></path><path stroke="#e01e5a" d="M110 305h.1v.1m97 0v97"></path></g></svg>
                        Login with Slack
                      </button>
                    </div>
                  )
                } else return null
              })
            }
          </div>
        </div>
        <div>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSeNd8uf2MWZn_EanmIeZh30uEN16l04tEBwLKgoGh8aenfQrg/viewform?usp=sharing&ouid=112368595577892277287" target="_blank" className="mt-4 btn btn-ghost btn-primary w-full text-primary hover:text-white text-sm">Report an issue</a>
        </div>
      </div>
    </div >
  );
}
