import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Navigation } from "@/components/Navigation.jsx";
import { HomePage } from "@/pages/HomePage.jsx";
import { NotFoundPage } from "@/pages/NotFoundPage.jsx";
import { PostError } from "@/pages/PostError.jsx";
import { PostPage } from "@/pages/PostPage.jsx";
import { ProfileError } from "@/pages/ProfileError.jsx";
import { ProfilePage } from "@/pages/ProfilePage.jsx";
import { homeLoader, postLoader, profileLoader } from "@/services/loaders.js";

function Layout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeLoader,
      },
      {
        path: "post/:id",
        element: <PostPage />,
        errorElement: <PostError />,
        loader: postLoader,
      },
      {
        path: "profile/:id",
        element: <ProfilePage />,
        errorElement: <ProfileError />,
        loader: profileLoader,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
