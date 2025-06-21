import { usePathname, useRouter } from "next/navigation";
import { Navbar } from "./components/Navbar/Navbar";
import { useRouterWithOptimisticPathname } from "./hooks/useOptimisticRouter";
import { CalendarToday, QrCode } from "@mui/icons-material";

export const ProtectedPageLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isPublicRoute } = useRouterWithOptimisticPathname();
  const pathname = usePathname();
  const router = useRouter();
  
  return (
    <div className={`flex flex-col w-full h-full items-center justify-center ${!isPublicRoute && "pt-[64px]"}`}>
      {!isPublicRoute && <Navbar />}
      <div className="flex flex-col w-full h-full max-w-[1280px] place-items-center p-6">
        {children}
      </div>
      <div className="dock md:hidden">
        <button className={pathname === "/home" ? "dock-active" : ""} onClick={() => router.push("/home")}>
          <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt"><polyline points="1 11 12 2 23 11" fill="none" stroke="currentColor" stroke-miterlimit="10" strokeWidth="2"></polyline><path d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7" fill="none" stroke="currentColor" strokeLinecap="square" stroke-miterlimit="10" strokeWidth="2"></path><line x1="12" y1="22" x2="12" y2="18" fill="none" stroke="currentColor" strokeLinecap="square" stroke-miterlimit="10" strokeWidth="2"></line></g></svg>
        </button>

        <button className={pathname === "/qr" ? "dock-active" : ""} onClick={() => router.push("/qr")}>
          <QrCode className="size-[1.2em]" />
        </button>

        <button className={pathname === "/calendar" ? "dock-active" : ""} onClick={() => router.push("/calendar")}>
          <CalendarToday className="size-[1.2em]" />
        </button>
      </div>
    </div>
  );
};
