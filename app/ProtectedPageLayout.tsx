import { Navbar } from "./components/Navbar/Navbar";
import { useRouterWithOptimisticPathname } from "./hooks/useOptimisticRouter";

export const ProtectedPageLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isPublicRoute } = useRouterWithOptimisticPathname();
  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      {!isPublicRoute && <Navbar />}
      <div className="flex flex-col w-full h-full max-w-[1280px] place-items-center p-6">
        {children}
      </div>
    </div>
  );
};
