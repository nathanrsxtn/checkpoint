import { useLoaderData, useParams } from "react-router";
import { Post } from "@/components/Post.jsx";

export function PostPage() {
  const { id } = useParams();
  const post = useLoaderData();

  return (
    <>
      <h1>Single Post View Page</h1>
      <p>Post ID {id}</p>
      <Post {...post} />
    </>
  );
}
