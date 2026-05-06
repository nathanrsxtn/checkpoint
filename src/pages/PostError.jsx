import { useParams, useRouteError } from "react-router";

export function PostError() {
  const { id } = useParams();
  const error = useRouteError();

  return (
    <>
      <h1>Error Post View Page</h1>
      <p>Post ID {id}</p>
      {error.status === 404 ? (
        <p>Post not found</p>
      ) : (
        <p>Something went wrong</p>
      )}
    </>
  );
}
