import { useState } from "react";

export function Post({ name, username, game, content, tag, likes, commentCount, shareCount, image }) {
  const [likeState, setLikeState] = useState(likes);
  const [commentState, setCommentState] = useState(commentCount);
  const [shareState, setShareState] = useState(shareCount);
  const [liked, setLiked] = useState(false);

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
  }

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

        <p className="post-text">
          {game} {content}
        </p>

        <p className="post-tag">{tag}</p>

        {image && <img className="post-image" src={image} alt={game} />}

        

        <div className="post-actions">
          <button onClick={handleLike}>❤️ {likeState}</button>
          <button>💬 {commentCount}</button>
          <button>📩 {shareCount}</button>
        </div>
      </div>
    </article>
    </>
  );
}
