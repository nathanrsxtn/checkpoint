import axios from "axios";

const api = axios.create({ baseURL: "/api" });

function handleError(error) {
  console.error(error);
  throw error.response?.data?.error || error.message || "Unexpected error";
}

export async function getPosts(signal) {
  try {
    const response = await api.get("/posts", { signal });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getPost(id, signal) {
  try {
    const response = await api.get(`/posts/${id}`, { signal });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getProfile(id, signal) {
  try {
    const response = await api.get(`/users/${id}`, { signal });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getMessages(signal) {
  try {
    const response = await api.get("/messages", {
      signal,
    });
    return response.data;
  } catch (error) {
    console.error("Get messages error:", error);
    return [];
  }
}
