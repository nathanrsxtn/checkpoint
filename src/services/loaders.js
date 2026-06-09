import { getMessages, getPost, getPosts, getProfile, getUsers } from "@/services/api.js";

export async function homeLoader({ request }) {
  const posts = await getPosts(request.signal);
  return { posts };
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

  //gets all of the posts which is not the most efficent but
  //I had extreme difficulty trying to get axios to just give the posts I asked for
  const posts = await getPosts(request.signal);
  const sparseUserPosts = posts.filter((post) => post.userId === id);

  const userPosts = await Promise.all(sparseUserPosts.map((post) => getPost(post._id, request.signal)));

  return { profile, userPosts };
}

export async function messagesLoader({ request }) {
  const messages = await getMessages(request.signal);
  const users = await getUsers(request.signal);

  return { messages, users };
}
