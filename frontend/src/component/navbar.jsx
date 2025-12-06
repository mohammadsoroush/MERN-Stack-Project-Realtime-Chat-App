import { Link, redirect } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

export const Navbar = () => {
  const { authUser, logOut } = useAuthStore();

  const handleLogout = async () => {
    await logOut();
    redirect("/login");
  };

  return (
    <header className="w-full bg-base-100 border-b border-base-300 fixed top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold">Chat App</h1>
        </Link>

        {/* Right side */}
        {authUser ? (
          <div className="flex items-center gap-4">
            {/* Username */}
            <span className="text-sm font-medium">{authUser.username}</span>

            {/* Settings Button */}
            <Link
              to="/setting"
              className="btn btn-sm btn-ghost flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>

            {/* Logout Button */}
            <button
              className="btn btn-sm btn-error flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-sm btn-primary">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};
