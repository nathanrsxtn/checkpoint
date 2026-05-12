export function Post({ game, content, tag, likes, commentCount, shareCount, image }) {
  return (
    <>
      <h2>{game}</h2>
      <p>Content: {content}</p>
      <p>Tag: {tag}</p>
      <p>Likes: {likes}</p>
      <p>Comments: {commentCount}</p>
      <p>Shares: {shareCount}</p>
      <img src={image} alt={game} width="300" />
    </>
  );
}
