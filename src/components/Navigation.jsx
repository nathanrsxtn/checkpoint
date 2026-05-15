import { Link } from "react-router";

export function Navigation() {
  return (
    <nav className="sidebar">
      <div className="logo">🏁 CheckPoint</div>
      <Link to="/">🏠 Home</Link>
      <Link to="/messages">💬 Messages</Link>
      <Link to="/profile/1">👤 Profile</Link>
      <Link to="/post/1">➕ Post</Link>
      <Link to="/login">Sign In</Link>
      <Link to="/signup">Sign Up</Link>
    </nav>
  );
}