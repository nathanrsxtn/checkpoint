import axios from "axios";

const api = axios.create({ baseURL: "/api" });

function handleError(error) {
  console.error(error);
  throw error.response?.data?.error || error.message || "Unexpected error";
}

// get all posts
export async function getPosts(signal) {
  try {
    const response = await api.get("/posts", { signal });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// get specific post
export async function getPost(id, signal) {
  try {
    const response = await api.get(`/posts/${id}`, { signal });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// get single specific profile based on id
export async function getProfile(id, signal) {
  try {
    const response = await api.get(`/users/${id}`, { signal });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// get all messages
export async function getMessages() {
  try {
    const response = await api.get("/messages");
    return response.data;
  } catch (error) {
    console.error("Get messages error:", error);
    return [];
  }
}