import { useLoaderData, useParams } from "react-router";
import "./ProfilePage.css";

export function ProfilePage() {
  const { id } = useParams();
  const profile = useLoaderData();

  return (
    <>
      <h1>Single Profile View Page</h1>
      <p>Profile ID {id}</p>

      <div className="profile-info">
        {profile.image && <img className="profile-image" src={profile.image} alt={profile.name} />}
        <div className="profile-text">
          <p>{profile.username}</p>
          <h2>{profile.name}</h2>
          <div className="profile-stats">
            <p>{profile.postCount} Posts</p>
            <p>{profile.followers} Followers</p>
            <p>{profile.following} Following</p>
          </div>
        </div>
      </div>
      <div className="post-section">
        
      </div>
    </>
  );
}
