import { createBrowserRouter } from "react-router-dom";
import { Root } from "../page/Root";
import Home from "../page/Home";
import SignUp from "../page/SignUp";
import LogIn from "../page/LogIn";
import Setting from "../page/Setting";
import Profile from "../page/Profile";
import { ProtectedRoute } from "../component/ProtectedRoutes";
import { PublicRoute } from "../component/PublicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { element: <Setting />, path: "/setting" },
      // { element: <LogIn />, path: "/login" },

      {
        element: <PublicRoute />,
        children: [
          { element: <LogIn />, path: "/login" },
          { element: <SignUp />, path: "/signup" },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          { element: <Home />, index: true },

          { element: <Profile />, path: "/profile" },
        ],
      },
    ],
  },
]);

export default router;
