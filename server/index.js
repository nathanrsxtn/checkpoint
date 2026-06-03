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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

console.log("MONGO_URI exists?", !!process.env.MONGO_URI);
// Connect Mongoose to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(()=> console.log("MongoDB is connected!"))
  .catch((error) => console.error("MongoDB connection failed: ", error))

const userSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true},
  username: {type: String, required: true, unique: true, trim: true, minLength: 3},
  email:{type: String, required:true, unique: true, lowercase: true, trim: true },
  password:{type: String, required: true, minLength: 8},
  postCount: {type: Number, default: 0},
  followers: {type: Number, default: 0},
  following: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now},
  // list of people folllowed and followers
  followerIds: { type: [String], default: [] },
  followingIds: { type: [String], default: [] },
});

const messageSchema = new mongoose.Schema({
  messageNum: Number,
  Sender: String,
  Recipient: String,
  Message: String,
});

const commentSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  textContent: { type: String, required: true },
  likes: { type: Number, default: 0 }
});

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    game: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String, default: "" },
    likes: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    image: { type: String, default: "" },
    comments: [commentSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "posts" }
);
const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema, "messages");
const Post = mongoose.model("Post", postSchema, "posts");

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
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        postCount: user.postCount,
        followers: user.followers,
        following: user.following,
      },
      token,
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
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(400).json({ error: "Invalid user id" });
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ error: "Failed to load posts." });
  }
});

// ============================================================
// POST /api/posts
// ============================================================
app.post("/api/posts", async (req, res) => {
  try {
    const post = await Post.create({
      userId: req.body.userId,
      name: req.body.name,
      username: req.body.username,
      game: req.body.game,
      content: req.body.content,
      tag: req.body.tag,
      image: req.body.image,
      likes: 0,
      commentCount: 0,
      shareCount: 0,
      comments: [],
    });

    res.status(201).json({
      message: "Post created successfully.",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Failed to create post." });
  }
});

app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Get post error:", error);
    res.status(400).json({ error: "Invalid post id" });
  }
});

app.get("/api/users/:id/posts", async (req, res) => {
  try {
    const userPosts = await Post.find({
      userId: req.params.id,
    }).sort({ createdAt: -1 });

    res.json(userPosts);
  } catch (error) {
    console.error("Get user posts error:", error);
    res.status(500).json({ error: "Failed to load user posts." });
  }
});


// Handles Following
app.post("/api/users/:id/follow", async (req, res) => {
  try {
    const userToFollowId = req.params.id;
    const { currentUserId } = req.body;
    if (currentUserId === userToFollowId) {
      return res.status(400).json({ error: "You cannot follow yourself." });
    }
    // find the person you want to follow by Id
    const currentUser = await User.findById(currentUserId);
    const userToFollow = await User.findById(userToFollowId);
    if (!currentUser || !userToFollow) {
      return res.status(404).json({ error: "User not found." });
    }

    if (currentUser.followingIds.includes(userToFollowId)) {
      return res.status(400).json({ error: "Already following this user." });
    }
    // Add followed user to following and current user to their followers
    currentUser.followingIds.push(userToFollowId);
    userToFollow.followerIds.push(currentUserId);
    currentUser.following = currentUser.followingIds.length;
    userToFollow.followers = userToFollow.followerIds.length;
    await currentUser.save();
    await userToFollow.save();

    res.json({
      message: "User followed.",
      currentUser,
      userToFollow,
    });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ error: "Failed to follow user." });
  }
});

app.get("/api/messages", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

export default app;
