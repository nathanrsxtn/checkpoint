import { useState } from "react";
import "@/components/Comments.css";

export function Comments({ postId, comments: initialComments = [], setCommentState }) {
  const [comments, setComments] = useState(initialComments);
  const [input, setInput] = useState("");
  const user = JSON.parse(localStorage.getItem("User"));

  const handleAddComment = async () => {
    if (!input.trim()) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, username: user.username, textContent: input }),
      });
      if (!response.ok) {
        console.error("Failed to send message");
        return;
      }
      const data = await response.json();
      setComments((prev) => [...prev, data.comment]);
      setCommentState(data.commentCount);
      setInput("");
    } catch (error) {
      console.log("Post comment error: ", error);
    }
  };

  return (
    <div className="comments-panel">
      <div className="comments-list">
        {comments.map((comment, index) => (
          <div className="comment-box" key={comment._id || index}>
            <span className="comment-user">@{comment.username || "Anon"}: </span>
            <span className="comment-text">{comment.textContent}</span>
          </div>
        ))}
      </div>

      <div className="comment-input">
        <h3>Write a comment: </h3>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder=" ..." />
        <button type="button" onClick={handleAddComment}>
          Post
        </button>
      </div>
    </div>
  );
}
