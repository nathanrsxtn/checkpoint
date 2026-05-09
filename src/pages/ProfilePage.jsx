import { useLoaderData, useParams } from "react-router";

export function ProfilePage() {
  const { id } = useParams();
  const profile = useLoaderData()

  return (
    <>
      <h1>Single Profile View Page</h1>
      <p>Profile ID {id}</p>

      <h2>{profile.name}</h2>
      <p>Username: {profile.username}</p>
      <p>Posts: {profile.postCount}</p>
      <p>Followers: {profile.followers}</p>
      <p>Following: {profile.following}</p>
    </>
  );
}
