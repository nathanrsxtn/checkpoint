import { useState } from "react";
import "./Comments.css";

export function Comments() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");

  const handleAddComment = () => {
    if (!input.trim()) return;

    setComments((prev) => [...prev, input]);
    setInput("");
  };

  return (
    <div className="comments-panel">
      <div className="comment-input">
        <h3>Write a comment: </h3>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder=" ..."
        />
        <button onClick={handleAddComment}>Post</button>
      </div>
    </div>
  )
}