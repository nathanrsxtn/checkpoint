import { useState } from "react";
import "./Post.css";
import { Comments } from "./Comments"
import { Link, useNavigate } from "react-router";

export function Post({ _id, id, userId, userImage, name, username, game, content, tag, likes, likedBy = [], commentCount, shareCount, image, comments = [] }) {
  const [likeState, setLikeState] = useState(likes);
  const [commentState, setCommentState] = useState(commentCount);
  const [shareState, setShareState] = useState(shareCount);
  const currentUser = JSON.parse(localStorage.getItem("User"));
  const [liked, setLiked] = useState(currentUser && likedBy.includes(currentUser.id)); // post liked by user
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();
  const postId = _id || id;

  // Updated handle like that sees if user has already liked a post
  const handleLike = async () => {
    if (!currentUser) {
      alert("You must be logged in to like posts.");
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to like post.");
        return;
      }

      setLikeState(data.post.likes);
      setLiked(data.post.likedBy.includes(currentUser.id));
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  // handle when a userclicks url, it should create a link to share
  const handleShare = async () => {
  try {
    const response = await fetch(`/api/posts/${postId}/share`, {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to share post.");
      return;
    }

    setShareState(data.post.shareCount);

    // Builds a url to copy and adds it to the clipboard for sharing
    const postUrl = `${window.location.origin}/post/${postId}`;
    await navigator.clipboard.writeText(postUrl);

    alert("Post link copied!");
  } catch (error) {
    console.error("Share error:", error);
  }
};

  const userClick = () => {
    navigate(`/profile/${userId}`);
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <>
    {/* Main card wrapper is post-card */}
    <article className="post-card">

      <button onClick={userClick} className="post-avatar"><img src={userImage && userImage !== "" ? userImage : "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} alt=""></img></button>

      {/* Includes main post content */}
      <div className="post-main">
        <div className="post-header">
          <span>{name}</span>
          <span>{username}</span>
        </div>

        {image && <img className="post-image" src={image} alt={game} />}

        <p className="post-text">
          {game} {content}
        </p>

        <p className="post-tag">{tag}</p>

        <div className="post-actions">
          <button onClick={handleLike}>{liked ? "❤️" : "🩶"} {likeState}</button>
          <button onClick={toggleComments}>💬 {commentState}</button>
          <button onClick={handleShare}>📩 {shareState}</button>
        </div>
        {showComments && <Comments postId={postId} comments={comments} setCommentState={setCommentState}/>}
      </div>
    </article>
    </>
  );
}
