import { Home, LogIn, LogOut, MessageSquare, PlusCircle, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.jsx";

export function Navigation() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("User"));

  const handleLogout = () => {
    localStorage.removeItem("User");
    localStorage.removeItem("token");

    toast.success("Logged out.");
    navigate("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="font-bold text-xl">🏁 CheckPoint</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Home /> Home
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/messages">
                    <MessageSquare /> Messages
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={user ? `/profile/${user.id}` : "/login"}>
                    <User /> Profile
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/upload">
                    <PlusCircle /> Create Post
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {!user ? (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/login">
                  <LogIn /> Sign In
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut /> Log Out
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
