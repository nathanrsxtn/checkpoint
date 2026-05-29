import cors from "cors";
import express from "express";
import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import "dotenv/config";
import { posts, messages } from "./mockData.js";

import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

// Middleware — mount BEFORE any route 
app.use(cors());
app.use(express.json());

console.log("MONGO_URI exists?", !!process.env.MONGO_URI);
// Connect Mongoose to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(()=> console.log("MongoDB is connected!"))
  .catch((error) => console.error("MongoDB connection failed: ", error))

const userSchema = new mongoose.Schema({
  id: Number,
  name: {type: String, required: true, trim: true},
  username: {type: String, required: true, unique: true, trim: true, minLength: 3},
  email:{type: String, required:true, unique: true, lowercase: true, trim: true },
  password:{type: String, required: true, minLength: 8},
  postCount: {type: Number, default: 0},
  followers: {type: Number, default: 0},
  following: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
});

const messageSchema = new mongoose.Schema({
  messageNum: Number,
  Sender: String,
  Recipient: String,
  Message: String,
});



const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema, "messages");

function validateInputs({ name, username, email, password }) {

  if (!name.trim()) {
    return "Please enter your name.";
  }
  if (!username || username.trim().length < 3) {
    return "Username must be at least 3 characters.";
  }
  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
  }
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return "";
}

// ============================================================
// POST /api/register
// ============================================================
app.post("/api/register", async (req, res) => {
  const { name, username, email, password } = req.body;

  const validationError = validateInputs({ name, username, email, password });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const existing = await User.findOne({ username });
    if(existing) return res.status(409).json({ error: "Username already taken."});

    const hash = await bcrypt.hash(password, 10);  //<- the new line
    const newUser = await User.create({ name, username, email, password: hash, 
                                      postCount: 0, followers: 0, following: 0 });

    return res.status(201).json({
      message: "User registered successfully.",
      user: { id: newUser._id, name: newUser.name, username: newUser.username, email: newUser.email,
        postCount: newUser.postCount, followers: newUser.followers, following: newUser.following
      },   // never echo the password or the hash
    });
  } catch (error) {
    console.error("Register error:", error);
    // Mongoose duplicate-key error (race condition past the findOne check)
    if (error.code === 11000) {
      return res.status(409).json({ error: "Username or email already taken." });
    }
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// POST /api/login
// ============================================================
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const user = await User.findOne({ username });
    if(!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    const ok = await bcrypt.compare(password, user.password); //<- the new check
    
    if (!ok) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: "1h" })

    return res.status(200).json({
      message: "Login successful.",
      user: { username: user.username, email: user.email },
      token,   // the JWT — the client saves this in localStorage
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// POST /api/messages
// ============================================================
app.post("/api/messages", async (req,res) => {
  try {
    const message = await Message.create({
      messageNum: req.body.messageNum,
      Sender: req.body.Sender,
      Recipient: req.body.Recipient,
      Message: req.body.Message
    });

    return res.status(201).json({
      message: "Message saved to MongoDB",
      data: message,
    });
  } catch(error) {
    console.log("Message error: ", error);
    return res.status(500).json({ error: "Failed to save message"});

  }
});

app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/api/users/:id", async (req, res) => {
  const userId = Number(req.params.id);
  const user = await User.findOne({ id: userId });

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

app.get("/api/messages", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

export default app;
