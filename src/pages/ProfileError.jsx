import { useParams, useRouteError } from "react-router";

export function ProfileError() {
  const { id } = useParams();
  const error = useRouteError();

  return (
    <>
      <h1>Error Profile View Page</h1>
      <p>Profile ID {id}</p>
      {error.status === 404 ? (
        <p>Profile not found</p>
      ) : (
        <p>Something went wrong</p>
      )}
    </>
  );
}
