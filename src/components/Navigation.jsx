import { Link } from "react-router";

export function Navigation() {
  return (
    <nav className="flex flex-row gap-10">
      <Link to={"/"}>Go Home</Link>
      <Link to={"/login"}>Login</Link>
      <Link to={"/signup"}>Sign Up</Link>
      <Link to={"/post/1"}>Go To Test Post 1</Link>
      <Link to={"/profile/1"}>Go To Test Profile 1</Link>
    </nav>
  );
}
