import { useParams, useRouteError } from "react-router";

export function PostError() {
  const { id } = useParams();
  const error = useRouteError();

  return (
    <>
      <h1>Error Post View Page</h1>
      <p>Post ID {id}</p>
      <p>{error}</p>
    </>
  );
}
