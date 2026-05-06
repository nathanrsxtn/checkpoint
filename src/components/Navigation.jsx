import { Link } from "react-router";

export function Navigation() {
  return (
    <nav className="flex flex-row gap-10">
      <Link to={"/"}>Go Home</Link>
      <Link to={"/post/0"}>Go To Test Post 0</Link>
      <Link to={"/profile/0"}>Go To Test Profile 1</Link>
    </nav>
  );
}
