import "./ProfilePage.css";
import { useLoaderData } from "react-router";
import { Post } from "@/components/Post.jsx";

export function ProfilePage() {
  const { profile, userPosts } = useLoaderData();
  const user = profile;
  if (!user) {
    return (
      <>
        <h1>Profile</h1>
        <p>User not found</p>
      </>
    );
  }
  const loggedUser = JSON.parse(localStorage.getItem("User"));
  const ownProfile = loggedUser && user._id && loggedUser.id === user._id.toString();
  const handleFollow = async () => {
    if (!loggedUser) {
      alert("You must be logged in to follow users.");
      return;
    }
    try {
      const response = await fetch(`/api/users/${user._id}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: loggedUser.id }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to follow user.");
        return;
      }
      window.location.reload();
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

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
          {loggedUser && !ownProfile && (
            <button onClick={handleFollow}>Follow</button>
          )}
        </div>
      </div>
      <div className="posts-container">
        {userPosts.map((post) => (
          <Post key={post._id} {...post} />
        ))}
      </div>
    </>
  );
}