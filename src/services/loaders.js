import { getPost, getPosts, getProfile } from "@/services/api.js";

export async function homeLoader() {
  const posts = await getPosts();
  return { posts };
}

export async function postLoader({ params }) {
  const { id } = params;
  if (!id) throw new Response("Not Found", { status: 404 });
  const post = await getPost(id);
  if (!post) throw new Response("Not Found", { status: 404 });
  return post;
}

export async function profileLoader({ params }) {
  const { id } = params;
  if (!id) throw new Response("Not Found", { status: 404 });
  const profile = await getProfile(id);
  if (!profile) throw new Response("Not Found", { status: 404 });
  return profile;
}
