import { useRouterWithOptimisticPathname } from "@/app/hooks/useOptimisticRouter";
import Cookies from "js-cookie";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/outline";
import { userApi } from "@/lib/user/userApi";
import { useAppSelector } from "@/lib/hooks";

export const Avatar = () => {
  const router = useRouterWithOptimisticPathname();
  const userId = useAppSelector((state) => state.auth.userId);
  const { data: apiData } = userApi.useGetUserQuery(userId!, { skip: !userId });

  // TODO: Need UX
    const handleLogoutClick = () => {
        Cookies.remove("access_token");
    router.push("/login");
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        {!apiData?.photo ? (
          <UserIcon className="size-7" />
        ) : (
          <img alt="Tailwind CSS Navbar component" src={apiData.photo} />
        )}
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <Link href="/settings">Settings</Link>
        </li>
        <li>
          <a onClick={handleLogoutClick}>Logout</a>
        </li>
      </ul>
    </div>
  );
};
