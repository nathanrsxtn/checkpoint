import cors from "cors";
import express from "express";
import { posts, users } from "./mockData.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Social media API running");
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

app.get("/api/posts", (req, res) => {
  res.json(posts);
});

app.get("/api/posts/:id", (req, res) => {
  const postId = Number(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(post);
});

app.get("/api/users/:id/posts", (req, res) => {
  const userId = Number(req.params.id);
  const userPosts = posts.filter((p) => p.userId === userId);

  res.json(userPosts);
});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
