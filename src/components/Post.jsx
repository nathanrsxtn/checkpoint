export function Post({ game, content, tag, likes, commentCount, shareCount }) {
  return (
    <>
      <h2>{game}</h2>
      <p>Content: {content}</p>
      <p>Tag: {tag}</p>
      <p>Likes: {likes}</p>
      <p>Comments: {commentCount}</p>
      <p>Shares: {shareCount}</p>
    </>
  );
}
