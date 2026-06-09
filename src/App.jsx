import "@/App.css";
import { Loader2 } from "lucide-react";
import { createBrowserRouter, Outlet, RouterProvider, useNavigation } from "react-router";
import { Navigation } from "@/components/Navigation.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Toaster } from "@/components/ui/sonner.jsx";
import LoginForm from "@/forms/LoginForm.jsx";
import SignupForm from "@/forms/SignupForm.jsx";
import { HomeError } from "@/pages/HomeError.jsx";
import { HomePage } from "@/pages/HomePage.jsx";
import { MessagesPage } from "@/pages/MessagesPage.jsx";
import { NotFoundPage } from "@/pages/NotFoundPage.jsx";
import { PostError } from "@/pages/PostError.jsx";
import { PostPage } from "@/pages/PostPage.jsx";
import { ProfileError } from "@/pages/ProfileError.jsx";
import { ProfilePage } from "@/pages/ProfilePage.jsx";
import { UploadPostPage } from "@/pages/UploadPostPage.jsx";
import { homeLoader, messagesLoader, postLoader, profileLoader } from "@/services/loaders.js";

function Layout() {
  const navigation = useNavigation();
  const loading = navigation.state === "loading";

  return (
    <SidebarProvider>
      <div className="app-layout">
        <SidebarTrigger />
        <Navigation />

        <main className="main-content">
          <Outlet />
        </main>

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
            <div className="flex flex-col items-center gap-3 rounded-[6px] border border-border bg-background p-6 shadow-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}

export default Layout;

function LayoutLoading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Card className="w-65 border-muted">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="font-bold text-muted-foreground text-sm">Loading CheckPoint...</p>
        </CardContent>
      </Card>
    </div>
  );
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
        path: "upload",
        element: <UploadPostPage />,
      },
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "signup",
        element: <SignupForm />,
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
