import { useState } from "react";
import "./Post.css";
import { Comments } from "./Comments"

export function Post({ name, username, game, content, tag, likes, commentCount, shareCount, image }) {
  const [likeState, setLikeState] = useState(likes);
  const [commentState, setCommentState] = useState(commentCount);
  const [shareState, setShareState] = useState(shareCount);
  const [liked, setLiked] = useState(false); // is post liked by user
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (!liked) {
      // like post
      setLikeState((prev) => prev + 1);
      setLiked(true);
    } else {
      // undo like on post
      setLikeState((prev) => prev - 1);
      setLiked(false);
    }
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <>
    {/* Main card wrapper is post-card */}
    <article className="post-card">
      <div className="post-avatar">👤</div>

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
          <button onClick={handleLike}>❤️ {likeState}</button>
          <button onClick={toggleComments}>💬 {commentCount}</button>
          <button>📩 {shareCount}</button>
        </div>
        {showComments && <Comments />}
      </div>
    </article>
    </>
  );
}
