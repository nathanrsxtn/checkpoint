import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Comments } from "@/components/Comments.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";

export function Post({
  _id,
  id,
  userId,
  userImage,
  name,
  username,
  game,
  content,
  tag,
  likes,
  likedBy = [],
  commentCount,
  shareCount,
  image,
  comments = [],
}) {
  const [likeState, setLikeState] = useState(likes);
  const [commentState, setCommentState] = useState(commentCount);
  const [shareState, setShareState] = useState(shareCount);

  const currentUser = JSON.parse(localStorage.getItem("User"));

  const [liked, setLiked] = useState(currentUser && likedBy.includes(currentUser.id));

  const [showComments, setShowComments] = useState(false);

  const navigate = useNavigate();
  const postId = _id || id;

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser?.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to like post.");
        return;
      }

      setLikeState(data.post.likes);
      setLiked(data.post.likedBy.includes(currentUser.id));
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/share`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to share post.");
        return;
      }

      setShareState(data.post.shareCount);

      const postUrl = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(postUrl);

      toast.success("Post link copied!");
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  return (
    <Card className="w-full max-w-3xl rounded-[6px] border-8 border-post-border bg-post-background text-post-text">
      <CardContent className="px-[22px]">
        <div className="flex gap-[22px]">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 shrink-0 rounded-[6px] bg-white p-0 hover:bg-white"
            onClick={() => navigate(`/profile/${userId}`)}
          >
            <Avatar className="h-full w-full rounded-[6px]">
              <AvatarImage src={userImage} className="rounded-[6px] object-cover" />
              <AvatarFallback className="rounded-none bg-post-background text-white">{name?.charAt(0)?.toUpperCase() ?? "U"}</AvatarFallback>
            </Avatar>
          </Button>

          <div className="flex-1">
            <CardHeader className="rounded-[5px] bg-post-header-background p-[6px]">
              <div className="grid grid-cols-2 items-center text-center">
                <p className="font-semibold text-lg text-post-header-text">{name}</p>

                <p className="font-semibold text-lg text-post-header-text">@{username}</p>
              </div>
            </CardHeader>

            <div className="mt-3">
              {image && (
                <div className="mb-3 flex justify-center">
                  <img src={image} alt={game} className="w-[500px] max-w-full object-contain" />
                </div>
              )}

              <div className="flex flex-col items-center">
                <div className="max-w-2xl text-center">
                  <p className="text-post-text text-xl">
                    <span className="font-medium">{game}</span> {content}
                  </p>

                  {tag && <p className="mt-2 text-lg text-post-text">#{tag}</p>}
                </div>

                <div className="mt-3 flex gap-[70px]">
                  <Button
                    onClick={handleLike}
                    className="bg-post-action-background font-bold text-post-action-text transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110 hover:bg-post-action-background-hover"
                  >
                    {liked ? "❤️" : "🩶"} {likeState}
                  </Button>

                  <Button
                    onClick={() => setShowComments((prev) => !prev)}
                    className="bg-post-action-background font-bold text-post-action-text transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110 hover:bg-post-action-background-hover"
                  >
                    💬 {commentState}
                  </Button>

                  <Button
                    onClick={handleShare}
                    className="bg-post-action-background font-bold text-post-action-text transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110 hover:bg-post-action-background-hover"
                  >
                    ↩ {shareState}
                  </Button>
                </div>
              </div>
            </div>

            {showComments && (
              <div className="mt-8">
                <Comments postId={postId} comments={comments} setCommentState={setCommentState} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
