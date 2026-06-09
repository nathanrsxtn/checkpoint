import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import "@/pages/UploadPostPage.css";

export function UploadPostPage() {
  const [game, setGame] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [image, setImage] = useState("");

  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setImage("");
      return;
    }
    // Convert image into a Base64 string
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("User"));

    if (!user) {
      toast.error("You must be logged in to create a post.");
      navigate("/login");
      return;
    }

    if (!game.trim()) {
      toast.error("Please enter a game name.");
      return;
    }

    if (!content.trim()) {
      toast.error("Please add text to your post.");
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          name: user.name,
          username: user.username,
          game,
          content,
          tag,
          image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create post.");
        return;
      }

      toast.success("Post created!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Network error. Could not create post.");
    }
  };

  return (
    <div className="create-post-container">
      <h1 className="create-post-title">Create Post</h1>

      <div className="create-post-card">
        <form className="create-post-form" onSubmit={handleSubmit}>
          <label for="image-upload" className="form-label">
            Upload Image{" "}
          </label>

          {/* Accepts JPG, PNG, WEBP */}
          <label className="upload-label" htmlFor="image-upload">
            Upload Image
          </label>

          <input id="image-upload" className="upload-input" type="file" accept="image/*" onChange={handleImageChange} />

          {image && <img className="image-preview" src={image} alt="Preview" />}

          <label for="game-name-input" className="form-label">
            Game Name
          </label>

          <input id="game-name-input" placeholder="Game name" value={game} onChange={(event) => setGame(event.target.value)} />

          <label for="post-text-input" className="form-label">
            Post Text
          </label>

          <textarea id="post-text-input" placeholder="Post text" value={content} onChange={(event) => setContent(event.target.value)} />

          <label for="tags-input" className="form-label">
            Tags
          </label>

          <input id="tags-input" placeholder="Tags" value={tag} onChange={(event) => setTag(event.target.value)} />

          <button className="submit-btn" type="submit">
            Upload Post
          </button>
        </form>
      </div>
    </div>
  );
}
