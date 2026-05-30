import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

export function Navigation() {
  const user = JSON.parse(localStorage.getItem("User"));
  // Handles Logout
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("User");
    localStorage.removeItem("token");

    toast.success("Logged out.");
    navigate("/login");
  };
  return (
    <nav className="sidebar">
      <div className="logo">🏁 CheckPoint</div>

      <Link to="/">🏠 Home</Link>
      <Link to="/messages">💬 Messages</Link>

      <Link to={user ? `/profile/${user.id}` : "/login"}>
        👤 Profile
      </Link>

      <Link to="/post/1">🏞️ Post</Link>

      <Link to="/upload">➕ Create Post</Link>

      {/* if user is sign-in display logout button otherwise display sign in*/}
      {!user ? (
        <>
          <Link to="/login">Sign In</Link>
        </>
      ) : (
        <button onClick={handleLogout} className="logout-btn">
          🚪 Log Out
        </button>
      )}
    </nav>
  );
}