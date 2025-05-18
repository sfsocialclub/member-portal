import { useLogoutMutation } from "@/lib/auth/authApi";
import { authSlice } from "@/lib/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { userApi } from "@/lib/user/userApi";
import { UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Avatar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.userId);
  const { data: apiData } = userApi.useGetUserQuery(userId!, { skip: !userId });
  const [logout] = useLogoutMutation();

    const handleLogoutClick = () => {
    logout().then(()=> {
      dispatch(authSlice.actions.setRole(undefined));
      dispatch(authSlice.actions.setUserId(undefined));
    }).then(()=>window.location.reload());
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
        className="menu menu-sm dropdown-content bg-white rounded-xl z-[1] mt-3 w-52 p-2 shadow"
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
