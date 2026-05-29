import { createBrowserRouter, Outlet, RouterProvider, useNavigation } from "react-router";
import { Navigation } from "@/components/Navigation.jsx";
import { HomeError } from "@/pages/HomeError.jsx";
import { HomePage } from "@/pages/HomePage.jsx";
import { NotFoundPage } from "@/pages/NotFoundPage.jsx";
import { PostError } from "@/pages/PostError.jsx";
import { PostPage } from "@/pages/PostPage.jsx";
import { ProfileError } from "@/pages/ProfileError.jsx";
import { ProfilePage } from "@/pages/ProfilePage.jsx";
import LoginForm from "@/forms/LoginForm.jsx";
import SignupForm from "@/forms/SignupForm.jsx";
import { homeLoader, postLoader, profileLoader, messagesLoader } from "@/services/loaders.js";
import { MessagesPage } from "@/pages/MessagesPage.jsx";
import { Toaster } from "react-hot-toast";

import "./App.css"; 

function Layout() {
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  return (
    <div className="app-layout">
      <Navigation />

      <main className="main-content">
        {loading && <div>Loading...</div>}
        <Outlet />
      </main>
    </div>
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
        path: "messages",
        element: <MessagesPage />,
        loader: messagesLoader,
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
      { 
        path: "login", 
        element: <LoginForm /> 
      },
      { path: 
        "signup", 
        element: 
        <SignupForm /> 
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}
