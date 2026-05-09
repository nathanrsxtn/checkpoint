import { useLoaderData } from "react-router";
import { Post } from "@/components/Post.jsx";

export function HomePage() {
  const posts = useLoaderData();

  return (
    <>
      <h1>Home View Page</h1>
      <div>
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </>
  );
}
