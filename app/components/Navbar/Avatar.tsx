import { useAppSession } from "@/lib/hooks";
import { UserIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Avatar = () => {
  const userData = useAppSession();
  const image = userData.user.image;
  const router = useRouter();

    const handleLogoutClick = () => {
    signOut().then(() => { router.refresh() })
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        {!image ? (
          <UserIcon className="size-7" />
        ) : (
          <img className="rounded-full" alt="Tailwind CSS Navbar component" src={image} />
        )}
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-white rounded-xl z-[1] mt-3 w-52 p-2 shadow"
      >
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <Link href="/settings">Settings</Link>
        </li>
        <li>
          <a onClick={handleLogoutClick}>Log out</a>
        </li>
      </ul>
    </div>
  );
};
