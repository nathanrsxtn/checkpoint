import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000/api" });

export async function getPosts() {
  try {
    const response = await api.get("/posts");
    return response.data;
  } catch (error) {
    console.error("Get posts error:", error);
    return [];
  }
}

export async function getPost(id) {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get post error:", error);
    return null;
  }
}

export async function getProfile(id) {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}
