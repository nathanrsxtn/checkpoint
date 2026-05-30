import { useEffect, useState } from "react";
import "./ProfilePage.css";

export function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  if (!user) {
    return (
      <>
        <h1>Profile</h1>
        <p>You are not logged in.</p>
      </>
    );
  }
  return (
    <>
      <h1>Profile</h1>
      <div className="profile-info">
        <div className="profile-text">
          <p>@{user.username}</p>
          <h2>{user.name}</h2>
          <div className="profile-stats">
            <p>{user.postCount} Posts</p>
            <p>{user.followers} Followers</p>
            <p>{user.following} Following</p>
          </div>
        </div>
      </div>
    </>
  );
}