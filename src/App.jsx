import { createBrowserRouter, Outlet, RouterProvider, useNavigation } from "react-router";
import { Navigation } from "@/components/Navigation.jsx";
import { HomeError } from "@/pages/HomeError.jsx";
import { HomePage } from "@/pages/HomePage.jsx";
import { NotFoundPage } from "@/pages/NotFoundPage.jsx";
import { PostError } from "@/pages/PostError.jsx";
import { PostPage } from "@/pages/PostPage.jsx";
import { ProfileError } from "@/pages/ProfileError.jsx";
import { ProfilePage } from "@/pages/ProfilePage.jsx";
import { homeLoader, postLoader, profileLoader } from "@/services/loaders.js";

function Layout() {
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  return (
    <>
      <Navigation />
      {loading && <div>Loading...</div>}
      <Outlet />
    </>
  );
}

function LayoutLoading() {
  return <h1>Fullscreen Loading...</h1>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    hydrateFallbackElement: <LayoutLoading />,
    children: [
      {
        index: true,
        element: <HomePage />,
        errorElement: <HomeError />,
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
