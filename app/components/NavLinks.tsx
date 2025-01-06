"use client";
import { useAppSelector } from "@/lib/hooks";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouterWithOptimisticPathname } from "../hooks/useOptimisticRouter";

export const Navbar = () => {
  const router = useRouterWithOptimisticPathname();
  const pathname = usePathname();
  const role = useAppSelector((state) => state.auth.role);
  const isAdmin = role === "admin";

  const handleClick = () => {
    Cookies.remove("access_token");
    router.push("/login");
  };

  let navText = "SF Social Club";

  if (isAdmin) {
    navText += " Admin Page";
  }

  return (
    <div className="w-full bg-base-100 grid place-items-center">
      <div className="navbar bg-base-100 max-w-[1280px] p-0 m-0">
        <div className="flex-1">
          <Link className="btn btn-ghost text-xl" href="/home">
            {navText}
          </Link>
          <div className="gap-x-4 flex ml-4">
            {!isAdmin && (
              <>
                <Link
                  className={`${
                    pathname === "/home" ? "font-bold link-primary" : ""
                  }`}
                  href="/home"
                >
                  Home
                </Link>
                <Link
                  className={`${
                    pathname === "/calendar" ? "font-bold link-primary" : ""
                  }`}
                  href="/calendar"
                >
                  Calendar
                </Link>
                <Link
                  className={`${
                    pathname === "/point-shop" ? "font-bold link-primary" : ""
                  }`}
                  href="/point-shop"
                >
                  Point shop
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex-none gap-x-8 mr-4">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={handleClick}>Logout</a>
              </li>
            </ul>
          </div>
          {!isAdmin && <div className="btn btn-primary">Go to store</div>}
        </div>
      </div>
    </div>
  );
};
