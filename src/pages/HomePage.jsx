import { useLoaderData } from "react-router";
import { Post } from "@/components/Post.jsx";
import "./HomePage.css";
import { useState } from "react";

export function HomePage() {
  const { posts } = useLoaderData();
  const [toggledFeed, setToggledFeed] = useState("popular");
  const loggedUser = JSON.parse(localStorage.getItem("User"));

  const filteredFeed = () => {
    if (toggledFeed === "popular") {
      return [...posts].sort((a, b) => b.likes - a.likes);
    }

    if (toggledFeed === "recent") {
      return [...posts].sort((a, b) => b.createdAt - a.createdAt);
    }

    if (toggledFeed === "friends") {
      return posts.filter((post) =>
        loggedUser?.followingIds?.includes(post.userId)
      );
    }

    return posts;
  };


  return (
    <>
      <div className="feed-filters">
        <button className={`feed-filter ${toggledFeed === "popular" ? "active" : ""}`} onClick={() => setToggledFeed("popular")}>Popular</button>
        <button className={`feed-filter ${toggledFeed === "recent" ? "active" : ""}`} onClick={() => setToggledFeed("recent")}>Recent</button>
        <button className={`feed-filter ${toggledFeed === "friends" ? "active" : ""}`} onClick={() => setToggledFeed("friends")}>Friends</button>
      </div>
      
        <div className="posts-container">
          {filteredFeed().map((post) => (
            <Post key={post._id} {...post} />
          ))}
        </div>
    </>
  );
}
