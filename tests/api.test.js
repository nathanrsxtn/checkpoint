import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../server/index.js";
import { User, Post } from "../server/index.js";
import bcrypt from "bcryptjs";

console.log("TEST FILE LOADED");

// test /api/users route is reachable
describe("GET users test", () => {
  it("GET /api/users should respond", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// test /api/posts route is reachable
describe("GET posts test", () => {
  it("GET /api/posts should respond", async () => {
    const res = await request(app).get("/api/posts");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// test /api/messages route is reachable
describe("GET messages test", () => {
  it("GET /api/messages", async () => {
    const res = await request(app).get("/api/messages");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// test login route works
describe("Login route", () => {
  let testUserId;

  // create user before running login tests
  beforeAll(async () => {
    const hash = await bcrypt.hash("password123", 10);

    const user = await User.create({
      name: "Test",
      username: "logintest",
      email: "test@test.com",
      password: hash
    });

    testUserId = user._id;
  });

  // delete created test user after test
  afterAll(async () => {
    await User.deleteOne({ _id: testUserId });
  });

  // successful login flow test
  it("should login successfully, correct credentials", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: "logintest",
        password: "password123"
      });

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe("logintest"); // test username matches
    expect(res.body.token).toBeDefined(); // test token was created
  });

  // wrong password test
  it("should reject wrong password", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: "logintest",
        password: "wrongpassword" // submit incorrect password
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid username or password.");
  });

  // missing password test
  it("should reject missing field", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: "logintest" // no password submitted
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Username and password are required.");
  });
});

// test registering user and posting works
describe("Register and post flow", () => {
  console.log("REGISTER AND POST TEST STARTING");
  it("POST /api/register should create a user", async () => {
    const uniqueId = Date.now();
    const username = `testuser_${uniqueId}`;

    // create user inside test
    const userRes = await request(app)
      .post("/api/register")
      .send({
        name: "Test",
        username: username,
        email: `testemail_${uniqueId}@test.com`,
        password: "password123"
      });

    expect(userRes.status).toBe(201);

    const userId = userRes.body.user.id;

    // create post using test account
    const postRes = await request(app)
      .post("/api/posts")
      .send({
        userId,
        name: "Test User",
        username,
        game: "Valorant",
        content: "This is a test post",
        tag: "test",
        image: ""
      });
    
    expect(postRes.status).toBe(201);
    const postId = postRes.body.post._id;

    // delete test user from DB
    const userResult = await User.deleteOne({ _id: userId });
    expect(userResult.deletedCount).toBe(1);

    // delete test post from DB
    const postResult = await Post.deleteOne({ _id: postId  });
    expect(postResult.deletedCount).toBe(1);
  });
});

// test following users
describe("Follow route", () => {
  let userA;
  let userB;

  beforeAll(async () => {
    // create user A
    const resA = await request(app)
      .post("/api/register")
      .send({
        name: "User A",
        username: "user_a",
        email: "a@test.com",
        password: "password123"
      });

    userA = resA.body.user.id;

    // create user B
    const resB = await request(app)
      .post("/api/register")
      .send({
        name: "User B",
        username: "user_b",
        email: "b@test.com",
        password: "password123"
      });

    userB = resB.body.user.id;
  });

  afterAll(async () => {
    await User.deleteOne({ _id: userA });
    await User.deleteOne({ _id: userB });
  });

  // test normal follow user flow
  it("should allow user A to follow user B", async () => {
    const res = await request(app)
      .post(`/api/users/${userB}/follow`)
      .send({ currentUserId: userA });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User followed.");

    expect(res.body.currentUser.followingIds).toContain(userB);
    expect(res.body.userToFollow.followerIds).toContain(userA);
  });

  // test following same user twice
  it("should reject following the same user twice", async () => {
    // second follow attempt (already following)
    const res = await request(app)
      .post(`/api/users/${userB}/follow`)
      .send({ currentUserId: userA });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Already following this user.")
  });

  // test following self
  it("should reject trying to follow self", async () => {
    const res = await request(app)
      .post(`/api/users/${userA}/follow`)
      .send({ currentUserId: userA });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("You cannot follow yourself.");
  });

  it("should reject following non existant user", async () => {
    const fakeId = "6a1915aee42c92d858d5c1dd";

    const res = await request(app)
      .post(`/api/users/${fakeId}/follow`)
      .send({ currentUserId: userA });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User not found.")
  });
});

