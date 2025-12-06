import { Outlet, Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export const PublicRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  // console.log("authUser in PublicRoute", authUser);

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
