import { useLoaderData, useParams } from "react-router";
import { Post } from "@/components/Post.jsx";

export function PostPage() {
  const { id } = useParams();
  const post = useLoaderData();

  return (
    <>
      <h1>View Post</h1>
      <Post post={post} />
    </>
  );
}
