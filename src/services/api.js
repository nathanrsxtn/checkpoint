import axios from "axios";

const api = axios.create({ baseURL: "/api" });

function handleError(error) {
  if (axios.isCancel(error)) return;
  console.error(error);
  throw error.response?.data?.error || (error.response ? (`${error.message} (${error.response.statusText})`) : error.message) || "Unexpected error";
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

// get all users
export async function getUsers(signal) {
  try {
    const response = await api.get("/users", { signal });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// like specific post
export async function likePost(id, userId, signal) {
  try {
    const response = await api.post(`/posts/${id}/like`, { userId }, { signal });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// share specific post
export async function sharePost(id, signal) {
  try {
    const response = await api.post(`/posts/${id}/share`, null, { signal });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}
