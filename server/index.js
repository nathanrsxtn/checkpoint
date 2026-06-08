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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Middleware — mount BEFORE any route 

// server.js — add to the top middleware section
//const cors = require("cors");
app.use(cors({
  origin: [
    "http://localhost:5173",                       // dev
    "https://checkpoint-pink.vercel.app",          // <-- your Vercel URL (after Step D)
    /\.vercel\.app$/,                              // optional: preview branches
  ],
  credentials: true,
}));

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connect Mongoose to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(()=> console.log("MongoDB is connected!"))
  .catch((error) => console.error("MongoDB connection failed: ", error))

const userSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true},
  username: {type: String, required: true, unique: true, trim: true, minLength: 3},
  email:{type: String, required:true, unique: true, lowercase: true, trim: true },
  image: { type: String, default: "" },
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
  userId: { type: String, required: true },
  username: { type: String, required: true },
  textContent: { type: String, required: true },
  likes: { type: Number, default: 0 }
});

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userImage: { type: String, default: ""},
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
    likes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
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

// server.js — add anywhere in your routes section
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    mongo: mongoose.connection.readyState === 1,
  });
});

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
        followerIds: user.followerIds,
        followingIds: user.followingIds,
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

// ============================================================
// POST /api/comments
// ============================================================
app.post("/api/posts/:id/comments", async (req,res) => {
  try {
    const { userId, username, textContent } = req.body;

    const comment = {
      userId,
      username,
      textContent,
      likes: 0,
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: comment },
        $inc: { commentCount: 1},
      },
      { new: true }
    );

    if(!post) {
      return res.status(404).json({ error: "Post not found."});
    }

    return res.status(201).json({
      message: "comment saved to MongoDB",
      comment: post.comments[post.comments.length -1],
      commentCount: post.commentCount,
    });
  } catch(error) {
    console.log("Comment error: ", error);
    return res.status(500).json({ error: "Failed to save comment"});

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
    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    //this takes all of the posts we just grabbed from posts,
    const postsWithLatestImages = await Promise.all(
      posts.map(async (post) => {

        //for each one it creats a user by finding them using their username
        const user = await User.findOne({ username: post.username });
        
        //then it returns the post but makes it's userImage the latest one from the db
        return {
          ...post,
          // Use the latest user image from the DB, fallback to their old post image
          userImage: user && user.image ? user.image : post.userImage
        };
      })
    );

    res.json(postsWithLatestImages);
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

    //when we create a post we need to get the user who is creating it,
    //in doing that we can get thier profile picture and set it properly on the post
    const user = await User.findOne({username: req.body.username});
    const profilePictureString = user ? user.image : "";

    const post = await Post.create({
      userId: req.body.userId,
      userImage: profilePictureString,
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

    await User.findByIdAndUpdate(req.body.userId, {$inc: { postCount: 1 },});

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

// Handles unfollowing
app.post("/api/users/:id/unfollow", async (req, res) => {
  try {
    const userToUnfollowId = req.params.id;
    const { currentUserId } = req.body;

    const currentUser = await User.findById(currentUserId);
    const userToUnfollow = await User.findById(userToUnfollowId);

    if (!currentUser || !userToUnfollow) {
      return res.status(404).json({ error: "User not found." });
    }

    currentUser.followingIds = currentUser.followingIds.filter((id) => id !== userToUnfollowId);
    userToUnfollow.followerIds = userToUnfollow.followerIds.filter((id) => id !== currentUserId);

    currentUser.following = currentUser.followingIds.length;
    userToUnfollow.followers = userToUnfollow.followerIds.length;

    await currentUser.save();
    await userToUnfollow.save();

    res.json({
      message: "User unfollowed.",
      currentUser,
      userToUnfollow,
    });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({ error: "Failed to unfollow user." });
  }
});

app.get("/api/messages", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// Handles updating profile picture
app.post("/api/users/:id/picture", async (req, res) => {
  try {

    //get the id of the user trying to make the request
    const { id } = req.params;

    //get the user id of the person attempting to make the change as
    //well as the base64 encoded string
    const { currentUserId, profilePicture } = req.body;

    //if the currentUserID trying to change the profile picture isn't
    //the actual person who owns the account return an error.
    if(currentUserId !== id){
      return res.status(403).json({ error: "Unauthorized to update this profile picture." });
    }

    //check to see if they actually gave you something
    if (!profilePicture || typeof profilePicture !== 'string') {
      return res.status(400).json({ error: "Invalid or missing profilePicture string." });
    }

    //we use the id to find then subsequently update the profile picture.
    const updateUser = await User.findByIdAndUpdate(
      id, 
      { image: profilePicture },
      { returnDocument: 'after' } //this returns the updated document so we can user it below
      //to update the frontedn
    );

    //if we didn't find a user
    if (!updateUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({
      message: "Profile picture updated.",
      user: updateUser
    });
  } catch (error) {
    console.error("Profile picture update error:", error);
    res.status(500).json({ error: "Failed to update profile picture user." });
  }
});

// Handles liking and removing that like functionality
app.post("/api/posts/:id/like", async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (!userId) {
      return res.status(400).json({ error: "User must be logged in." });
    }

    const alreadyLiked = post.likedBy.includes(userId);

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter((id) => id !== userId);
    } else {
      post.likedBy.push(userId);
    }

    post.likes = post.likedBy.length;

    await post.save();

    res.json({
      message: alreadyLiked ? "Post unliked." : "Post liked.",
      post,
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ error: "Failed to like post." });
  }
});

// Handles sharing a post
app.post("/api/posts/:id/share", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { shareCount: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.json({
      message: "Post shared.",
      post,
    });
  } catch (error) {
    console.error("Share error:", error);
    res.status(500).json({ error: "Failed to share post." });
  }
});

export default app;
