// routes.jsx
import { HomeIcon, UserCircleIcon, ServerStackIcon, RectangleStackIcon, MagnifyingGlassIcon, UserGroupIcon, MapIcon } from "@heroicons/react/24/solid";
import { Home, Profile, Subscribers, Search, Overview } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    title: "Dashboard",
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "home",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "subscribers",
        path: "/subscribers",
        element: <Subscribers />,
      },
      {
        icon: <MagnifyingGlassIcon {...icon} />,
        name: "search",
        path: "/search",
        element: <Search />,
      },
    ],
  },
  {
    title: "About",
    layout: "dashboard",
    pages: [
      {
        icon: <MapIcon {...icon} />,
        name: "overview",
        path: "/overview",
        element: <Overview />,
      }
    ],
  },
  {
    // title: "Auth",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      }
    ],
  },
];

export default routes;

