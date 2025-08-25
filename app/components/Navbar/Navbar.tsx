"use client"
import { useAppSession } from "@/lib/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "./Avatar";
import AnnouncementIcon from '@mui/icons-material/Announcement';
import Tooltip from "@mui/material/Tooltip";

export const Navbar = () => {
  const session = useAppSession();
  const pathname = usePathname();

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
            className="menu menu-sm dropdown-content bg-white rounded-lg z-1 mt-3 w-52 p-2 shadow">
            <li onClick={handleMenuItemClick}><Link  className={`${pathname === '/home' ? 'font-bold link-primary' : ''}`} href="/home">
              Home
            </Link></li>
            <li onClick={handleMenuItemClick}><Link className={`${pathname === '/qr' ? 'font-bold link-primary' : ''}`} href="/qr">
              Member ID
            </Link></li>
            <li onClick={handleMenuItemClick}><Link className={`${pathname === '/calendar' ? 'font-bold link-primary' : ''}`} href="/calendar">
              Calendar
            </Link></li>
            {/* <li onClick={handleMenuItemClick}><Link className={`${pathname === '/point-shop' ? 'font-bold link-primary' : ''}`} href="/point-shop">
              Point shop
            </Link></li> */}
            {
              session.user.isAdmin && (
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
          <Link className="text-xl uppercase font-bold font-[Red_Hat_Display]" href="/home">SF Social Club</Link>
        </div>
        <div className="gap-x-4 lg:flex hidden">
          <Link className={`${pathname === '/home' ? 'font-bold link-primary' : ''}`} href="/home">
            Home
          </Link>
          <Link className={`${pathname === '/qr' ? 'font-bold link-primary' : ''}`} href="/qr">
            Member ID
          </Link>
          <Link className={`${pathname === '/calendar' ? 'font-bold link-primary' : ''}`} href="/calendar">
            Calendar
          </Link>
          {/* <Link className={`${pathname === '/point-shop' ? 'font-bold link-primary' : ''}`} href="/point-shop">
            Point shop
          </Link> */}
          {
            session.user.isAdmin && (
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
      <div className="flex flex-none items-center gap-x-6 pr-4">
        <Tooltip title="Report an issue"><a href="https://docs.google.com/forms/d/e/1FAIpQLSeNd8uf2MWZn_EanmIeZh30uEN16l04tEBwLKgoGh8aenfQrg/viewform?usp=sharing&ouid=112368595577892277287" target="_blank"><AnnouncementIcon className="text-primary opacity-80 scale-x-[-1] hover:cursor-pointer hover:opacity-100" fontSize="small"/></a></Tooltip>
        <Avatar/>
        <div className="btn btn-primary hidden lg:flex">Go to store</div>
      </div>
    </div>
  )
}