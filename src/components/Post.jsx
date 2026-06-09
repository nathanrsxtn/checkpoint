import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Comments } from "@/components/Comments.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { getPost, likePost, sharePost } from "@/services/api.js";

export function Post({ post: initialPost }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("User"));

  const postId = initialPost?._id;

  const [post, setPost] = useState(initialPost);

  const [liked, setLiked] = useState(currentUser && initialPost?.likedBy?.includes(currentUser.id));

  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1, rootMargin: "0px" });

  useEffect(() => {
    if (!postId) return;
    if (!inView) return;

    const controller = new AbortController();
    let mounted = true;

    setLoading(true);

    (async () => {
      try {
        const data = await getPost(postId, controller.signal);
        if (!data) return; // Canceled
        if (!mounted) return;

        setPost(data);
        setLiked(data.likedBy?.includes(currentUser?.id));
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [postId, inView, currentUser?.id]);

  const handleLike = async () => {
    try {
      const data = await likePost(postId, currentUser?.id);

      setPost((prev) => ({ ...prev, likes: data.post.likedBy.length, likedBy: data.post.likedBy }));

      setLiked(data.post.likedBy.includes(currentUser.id));
    } catch (error) {
      console.error("Like error:", error);
      toast.error(error || "Failed to like post.");
    }
  };

  const handleShare = async () => {
    try {
      const data = await sharePost(postId);

      setPost((prev) => ({ ...prev, shareCount: data.post.shareCount }));

      const postUrl = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(postUrl);

      toast.success("Post link copied!");
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to share post.");
    }
  };

  if (!post) return null;

  return (
    <Card ref={ref} className="w-full max-w-3xl rounded-[6px] border-8 border-post-border bg-post-background text-post-text">
      <CardContent className="px-[22px]">
        <div className="flex gap-[22px]">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 shrink-0 rounded-[6px] bg-white p-0 hover:bg-white"
            onClick={() => navigate(`/profile/${post.userId}`)}
          >
            {loading && !post.userImage ? (
              <Skeleton className="h-16 w-16 rounded-[6px]" />
            ) : (
              <Avatar className="h-full w-full rounded-[6px]">
                <AvatarImage src={post.userImage} className="rounded-[6px] object-cover" />
                <AvatarFallback className="rounded-none bg-post-background text-white">
                  {post.name?.charAt(0)?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </Button>

          <div className="flex-1">
            <CardHeader className="rounded-[5px] bg-post-header-background p-[6px]">
              <div className="grid grid-cols-2 items-center text-center">
                <p className="font-semibold text-lg text-post-header-text">{post.name}</p>
                <p className="font-semibold text-lg text-post-header-text">@{post.username}</p>
              </div>
            </CardHeader>

            <div className="mt-3">
              {loading && !post.image ? (
                <div className="mb-3 flex justify-center">
                  <Skeleton className="h-[280px] w-[500px] max-w-full rounded-md" />
                </div>
              ) : (
                post.image && (
                  <div className="mb-3 flex min-h-[280px] justify-center">
                    <img src={post.image} alt={post.game} className="w-[500px] max-w-full object-contain" />
                  </div>
                )
              )}

              <div className="flex flex-col items-center">
                <div className="max-w-2xl text-center">
                  <p className="text-post-text text-xl">
                    <span className="font-medium">{post.game}</span> {post.content}
                  </p>

                  {post.tag && <p className="mt-2 text-lg text-post-text">#{post.tag}</p>}
                </div>

                <div className="mt-3 flex gap-[70px]">
                  <Button
                    onClick={handleLike}
                    className="bg-post-action-background font-bold text-post-action-text transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110 hover:bg-post-action-background-hover"
                  >
                    {liked ? "❤️" : "🩶"} {post.likedBy.length}
                  </Button>

                  <Button
                    onClick={() => setShowComments((p) => !p)}
                    className="bg-post-action-background font-bold text-post-action-text transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110 hover:bg-post-action-background-hover"
                  >
                    💬 {post.commentCount}
                  </Button>

                  <Button
                    onClick={handleShare}
                    className="bg-post-action-background font-bold text-post-action-text transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110 hover:bg-post-action-background-hover"
                  >
                    ↩ {post.shareCount}
                  </Button>
                </div>
              </div>
            </div>

            {showComments && (
              <div className="mt-8">
                <Comments
                  postId={postId}
                  comments={post.comments}
                  setCommentState={(commentCount) => setPost((p) => ({ ...p, commentCount }))}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
