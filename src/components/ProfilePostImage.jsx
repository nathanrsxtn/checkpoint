export function ProfilePostImage({ src, alt }) {
  const handleClick = () => {
    console.log("expand image ", src);
    //todo: expand posts on user profile when clicked
  };

  return (
    <img
      className="post-image"
      src={src}
      alt={alt}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    />
  );
}