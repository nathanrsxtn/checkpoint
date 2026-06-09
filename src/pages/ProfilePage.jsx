import "@/pages/ProfilePage.css";
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
  const isFollowing = loggedUser && user.followerIds?.includes(loggedUser.id);

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
      // updates who you follow in right away to update friends tab
      localStorage.setItem(
        "User",
        JSON.stringify({
          id: data.currentUser._id,
          name: data.currentUser.name,
          username: data.currentUser.username,
          email: data.currentUser.email,
          postCount: data.currentUser.postCount,
          followers: data.currentUser.followers,
          following: data.currentUser.following,
          followerIds: data.currentUser.followerIds,
          followingIds: data.currentUser.followingIds,
        }),
      );
      window.location.reload();
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`/api/users/${user._id}/unfollow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: loggedUser.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to unfollow user.");
        return;
      }
      // updates who you follow in right away to update friends tab
      localStorage.setItem(
        "User",
        JSON.stringify({
          id: data.currentUser._id,
          name: data.currentUser.name,
          username: data.currentUser.username,
          email: data.currentUser.email,
          postCount: data.currentUser.postCount,
          followers: data.currentUser.followers,
          following: data.currentUser.following,
          followerIds: data.currentUser.followerIds,
          followingIds: data.currentUser.followingIds,
        }),
      );
      window.location.reload();
    } catch (error) {
      console.error("Unfollow error:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    //if they didn't give us an image set the image to nothing
    if (!file) {
      return Promise.resolve("");
    }

    return new Promise((resolve) => {
      //create a new reader
      const reader = new FileReader();

      //once the reader has done it's work resolve the promise giving handleImageUpdate what it needs
      reader.onloadend = () => {
        resolve(reader.result);
      };

      //use the reader to convert the file you gave to a base64 encoded string
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpdate = async (image) => {
    try {
      const response = await fetch(`/api/users/${user._id}/picture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: loggedUser.id, profilePicture: image }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update profile picture.");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Profile picture error:", error);
    }
  };

  return (
    <>
      <h1>Profile</h1>
      <div className="profile-info">
        {loggedUser && ownProfile && (
          <label className="post-avatar" htmlFor="image-upload">
            <img
              src={
                user.image && user.image !== ""
                  ? user.image
                  : "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
              }
              alt=""
            ></img>
          </label>
        )}
        {!ownProfile && (
          <img
            className="post-avatar"
            src={
              user.image && user.image !== ""
                ? user.image
                : "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
            }
            alt=""
          ></img>
        )}

        <input
          id="image-upload"
          className="upload-input"
          type="file"
          accept="image/*"
          //when a user gives us a new profile picture we want to do a few things
          //first we call handleImageChange which will take the file we've given it and convert it to a base64 encoded string
          //handleImageUpdate actually calls the backend to update mongodb
          onChange={async (event) => {
            const image = await handleImageChange(event);
            if (image) {
              await handleImageUpdate(image);
            }
          }}
        />

        <div className="profile-text">
          <p>@{user.username}</p>
          <h2>{user.name}</h2>
          <div className="profile-stats">
            <p>{user.postCount} Posts</p>
            <p>{user.followers} Followers</p>
            <p>{user.following} Following</p>
          </div>
          {loggedUser && !ownProfile && (
            <button
              type="button"
              className={isFollowing ? "unfollow-btn" : "follow-btn"}
              onClick={isFollowing ? handleUnfollow : handleFollow}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>
      <div className="posts-container">
        {userPosts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </>
  );
}
