import { useRouteError } from "react-router";

export function HomeError() {
  const error = useRouteError();

  return (
    <>
      <h1>Home View Error Page</h1>
      <p>{error || "Something went wrong with route."}</p>
    </>
  );
}
