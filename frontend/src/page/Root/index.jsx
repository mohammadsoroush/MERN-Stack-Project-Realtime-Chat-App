// Root.jsx
import { Outlet } from "react-router-dom";
import { Navbar } from "../../component/navbar";
import useAuthStore from "../../store/useAuthStore";
import { useEffect } from "react";
import useThemeStore from "../../store/useThemeStore";

export const Root = () => {
  const { checkAuthUser, authUser, connectSocket, onlineUsers } =
    useAuthStore();
  const { theme } = useThemeStore();

  console.log("onlineUsers:", onlineUsers);

  useEffect(() => {
    checkAuthUser();
  }, [checkAuthUser]);

  useEffect(() => {
    console.log("useefect outside", authUser);
    if (authUser?._id) {
      console.log("useefect inside", authUser);

      connectSocket();
    }
  }, [authUser]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme || "light");
  }, [theme]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
