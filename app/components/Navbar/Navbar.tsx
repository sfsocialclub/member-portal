"use client"
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "./Avatar";

export const Navbar = () => {
  const pathname = usePathname();
  const role = useAppSelector(state => state.auth.role)
  const isAdmin = role === 'admin';

  const handleMenuItemClick = () =>{
      const elem: HTMLElement = document.activeElement as HTMLElement;
      if (elem) {
        elem?.blur();
      }
    };

  return (
    <div className="navbar bg-white fixed top-0 z-10">
      <div className="navbar-start flex-1">
        <div className="dropdown z-10">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li onClick={handleMenuItemClick}><Link  className={`${pathname === '/home' ? 'font-bold link-primary' : ''}`} href="/home">
              Home
            </Link></li>
            <li onClick={handleMenuItemClick}><Link className={`${pathname === '/calendar' ? 'font-bold link-primary' : ''}`} href="/calendar">
              Calendar
            </Link></li>
            <li onClick={handleMenuItemClick}><Link className={`${pathname === '/point-shop' ? 'font-bold link-primary' : ''}`} href="/point-shop">
              Point shop
            </Link></li>
            {
              isAdmin && (
                <li onClick={handleMenuItemClick}><Link
                  className={`${pathname === '/admin' ? 'font-bold link-primary' : ''}`}
                  href="/admin"
                >
                  Admin
                </Link></li>
              )
            }
          </ul>
        </div>
        <div className="shrink-0 flex justify-center lg:w-80">
          <Link className="btn btn-ghost text-xl" href="/home">SF Social Club</Link>
        </div>
        <div className="gap-x-4 lg:flex hidden">
          <Link className={`${pathname === '/home' ? 'font-bold link-primary' : ''}`} href="/home">
            Home
          </Link>
          <Link className={`${pathname === '/calendar' ? 'font-bold link-primary' : ''}`} href="/calendar">
            Calendar
          </Link>
          {/* <Link className={`${pathname === '/point-shop' ? 'font-bold link-primary' : ''}`} href="/point-shop">
            Point shop
          </Link> */}
          {
            isAdmin && (
              <Link
                className={`${pathname === '/admin' ? 'font-bold link-primary' : ''}`}
                href="/admin"
              >
                Admin
              </Link>
            )
          }
        </div>
      </div>
      <div className="flex flex-none gap-x-8 pr-4">
        <Avatar/>
        <div className="btn btn-primary hidden lg:flex">Go to store</div>
      </div>
    </div>
  )
}