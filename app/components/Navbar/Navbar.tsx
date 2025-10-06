"use client"
import { useAppSession } from "@/lib/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "./Avatar";
import AnnouncementIcon from '@mui/icons-material/Announcement';
import Tooltip from "@mui/material/Tooltip";

const menuItems = [
  {
    label: 'Home',
    href: '/home',
    id: 'desktopHomeBtn'
  },
  {
    label: 'Member ID',
    href: '/qr',
    id: 'desktopQrBtn'
  },
  {
    label: 'Calendar',
    href: '/calendar',
    id: 'desktopCalendarBtn'
  },
  {
    label: 'Member Drive',
    href: 'https://drive.google.com/drive/folders/1imR6adO5qQDOcoekqQ8226GCA-uDDBcy?usp=drive_link',
    target: '_blank'
  },
  {
    label: 'SF Social Club Shop',
    href:'https://www.sfsocialclub.org/pages/shop',
    target: '_blank'
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/sf.socialclub',
    target: '_blank'
  },
  // {
  //   label: 'Point Shop',
  //   href:'/point-shop',
  // },
  {
    label: 'Help',
    href: '/help'
  },
  {
    label: 'Admin',
    href: '/admin',
    adminOnly: true
  }
]

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
            className="menu menu-sm dropdown-content bg-white rounded-lg z-1 mt-3 w-max p-2 shadow">
              {
                menuItems.filter((item) => !item.adminOnly || session.user.isAdmin).map((item) => (
                  <li key={item.label} onClick={handleMenuItemClick}>
                    <Link
                      className={`${item.href === pathname ? 'font-bold link-primary' : ''}`}
                      href={item.href}
                      target={item.target}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))
              }
            
          </ul>
        </div>
        <div className="shrink-0 flex justify-center lg:w-80">
          <Link className="text-xl uppercase font-bold font-[Red_Hat_Display]" href="/home">SF Social Club</Link>
        </div>
        <div className="gap-x-6 lg:flex hidden">
          {
            menuItems.filter((item) => !item.adminOnly || session.user.isAdmin).map((item) => (
              <Link
                key={item.label}
                className={`${item.href === pathname ? 'font-bold underline decoration-[.2rem]' : 'opacity-75 hover:opacity-100'} hover:underline text-sm underline-offset-[.3rem]`}
                href={item.href}
                id={item.id}
              >
                {item.label}
              </Link>
            ))
          }
        </div>
      </div>
      <div className="flex flex-none items-center gap-x-6 pr-4">
        <Tooltip title="Report an issue"><a href="https://forms.gle/n69k1yoXyn3sDKKR7" target="_blank"><AnnouncementIcon className="text-primary opacity-80 scale-x-[-1] hover:cursor-pointer hover:opacity-100" fontSize="small"/></a></Tooltip>
        <Avatar/>
      </div>
    </div>
  )
}