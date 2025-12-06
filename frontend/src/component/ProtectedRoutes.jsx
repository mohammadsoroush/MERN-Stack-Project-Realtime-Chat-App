import { Outlet, Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export const ProtectedRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Checking authentication...
      </div>
    );
  }
  // console.log("authUser in ProtectedRoute", authUser);

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
