export function Post({ name, username, game, content, tag, likes, commentCount, shareCount, image }) {
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
          <span>❤️ {likes}</span>
          <span>💬 {commentCount}</span>
          <span>📩 {shareCount}</span>
        </div>
      </div>
    </article>
    </>
  );
}
