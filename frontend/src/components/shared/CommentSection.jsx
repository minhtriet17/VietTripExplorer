import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const navigate = useNavigate();

  // console.log("All comments:", allComments)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.length > 200) {
      toast("Comment must be less than 200 characters");
      return;
    }

    // console.log("Data being sent:", { Content: comment, postId, userId: currentUser._id });

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast("Comment added successfully!");
        setComment("");
        setAllComments([data, ...allComments]);
      }
    } catch (error) {
      console.log(error);
      toast("Something went wrong! Please try again.");
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);

        if (res.ok) {
          const data = await res.json();
          setAllComments(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/Sign-in");
        return;
      }

      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });

      if (res.ok) {
        const data = await res.json();
        setAllComments(
          allComments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setAllComments(
      allComments.map((c) =>
        c._id === comment._id
          ? {
              ...c,
              content: editedContent,
            }
          : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    try {
      // console.log("Deleting comment with ID:", commentId)
      if (!currentUser) {
        navigate("/Sign-in");
        return;
      }

      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        setAllComments(
          allComments.filter((comment) => comment._id !== commentId)
        );
        toast("Comment deleted successfully!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6">
      {/* User Info */}
      {currentUser ? (
        <div className="flex flex-wrap items-center gap-2 my-5 text-gray-600 text-sm">
          <p>Đã đăng nhập với tư cách:</p>
          <img
            src={currentUser.profilePicture}
            alt="Profile Pic"
            className="h-6 w-6 object-cover rounded-full border border-gray-300"
          />
          <Link
            to="/dashboard?tav=profile"
            className="text-blue-800 hover:underline font-medium"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-gray-700 my-5 flex flex-wrap items-center gap-1">
          Bạn phải đăng nhập để thêm bình luận.
          <Link
            to="/Sign-in"
            className="text-blue-800 hover:underline font-medium"
          >
            Đăng nhập
          </Link>
        </div>
      )}

      {/* Comment Form */}
      {currentUser && (
        <form
          className="border border-gray-300 rounded-xl p-4 flex flex-col gap-4 shadow-sm"
          onSubmit={handleSubmit}
        >
          <Textarea
            name="comment"
            rows="4"
            maxLength="200"
            className="border border-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 p-3 rounded-md resize-none text-sm"
            placeholder="Viết bình luận của bạn ở đây..."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
            <p className="text-gray-500 text-sm">
              {200 - comment.length} characters remaining
            </p>
            <Button
              type="submit"
              className="bg-blue-600 text-white py-2 px-5 rounded-md hover:bg-blue-700 transition"
            >
              Bình luận
            </Button>
          </div>
        </form>
      )}

      {/* No Comments */}
      {allComments.length === 0 ? (
        <p className="text-sm mt-6 text-gray-500">Chưa có bình luận nào!</p>
      ) : (
        <>
          {/* Comments header */}
          <div className="text-sm my-6 flex items-center gap-2 font-semibold text-slate-700">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-3 rounded-md bg-gray-100 text-slate-700 text-xs">
              {allComments.length}
            </div>
          </div>

          {/* Comment List */}
          <div className="space-y-4">
            {allComments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentSection;
