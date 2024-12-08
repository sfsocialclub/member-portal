"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React from "react";
import LoadingPage from "./components/global/loadingPage";

export default function Portal() {
  const router = useRouter();
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const getRole = async () => {
      const token = Cookies.get("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const { data } = await axios.get("/api/member-role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            router.push("/login");
            return;
          }
        }

        router.push("/error");
      }
    };

    getRole();
  }, [router]);

  if (!data) {
    return <LoadingPage />;
  }

  // TODO: Reference return payload type and extract role
  switch ((data as any).role) {
    case "member":
      router.push("/member");
    case "admin":
      router.push("/admin");
    default:
      router.push("/error");
  }
}
