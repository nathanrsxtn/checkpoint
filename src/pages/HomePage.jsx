import { useLoaderData } from "react-router";
import { Post } from "@/components/Post.jsx";

export function HomePage() {
  const posts  = useLoaderData();

  return (
    <>
      <h1 className="home-title">CheckPoint</h1>
      <div className="home-feed">
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </>
  );
}
