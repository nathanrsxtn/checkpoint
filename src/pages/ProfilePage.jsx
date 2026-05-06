import { useParams } from "react-router";

export function ProfilePage() {
  const { id } = useParams();

  return (
    <>
      <h1>Single Profile View Page</h1>
      <p>Profile ID {id}</p>
    </>
  );
}
