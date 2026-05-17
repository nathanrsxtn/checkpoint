import { getPost, getPosts, getProfile, getMessages } from "@/services/api.js";

export async function homeLoader({ request }) {
  const posts = await getPosts(request.signal);
  return posts;
}

export async function postLoader({ params, request }) {
  const { id } = params;
  if (!id) throw new Response("Not Found", { status: 404 });
  const post = await getPost(id, request.signal);
  return post;
}

export async function profileLoader({ params, request }) {
  const { id } = params;
  if (!id) throw new Response("Not Found", { status: 404 });

  const profile = await getProfile(id, request.signal);
  const posts = await getPosts(request.signal);

  return { profile, posts };
}

export async function messagesLoader({ request }) {
  const messages = await getMessages(request.signal);
  return { messages };
}