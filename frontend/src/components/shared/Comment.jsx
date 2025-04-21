import moment from "moment";
import React, { useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
} from "../ui/alert-dialog";

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({});
  //console.log(user)

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);

        const data = await res.json();

        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });

      if (res.ok) {
        toast("Comment edited successfully!");
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex p-4 border-b border-slate-200 text-sm gap-3 sm:gap-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Username + Time */}
        <div className="flex flex-wrap items-center gap-2 mb-1 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">
            @{user?.username || "Unknown"}
          </span>
          <span className="text-gray-400 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {/* Comment content or Edit mode */}
        {isEditing ? (
          <>
            <Textarea
              className="mb-2 text-sm"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                className="bg-green-600 text-white px-4 py-1.5 text-sm"
                onClick={handleSave}
              >
                Lưu
              </Button>
              <Button
                type="button"
                variant="outline"
                className="text-red-600 border-red-400 hover:bg-red-50 text-sm"
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-slate-700 leading-relaxed mb-2 whitespace-pre-wrap break-words">
              {comment.content}
            </p>

            {/* Like + Edit/Delete Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-gray-500 border-t border-slate-200 mt-2">
              {/* Like Button */}
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`flex items-center gap-1 transition ${
                  currentUser && comment.likes.includes(currentUser._id)
                    ? "text-blue-600"
                    : "hover:text-blue-500"
                }`}
              >
                <AiFillLike className="text-lg" />
                {comment.numberOfLikes > 0 && (
                  <span>
                    {comment.numberOfLikes}{" "}
                    {comment.numberOfLikes === 1 ? "like" : "likes"}
                  </span>
                )}
              </button>

              {/* Edit + Delete (only owner or admin) */}
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="hover:text-green-600 transition cursor-pointer"
                    >
                      Chỉnh sửa
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span className="hover:text-red-600 cursor-pointer transition">
                          Xóa
                        </span>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Bạn có chắc chắn xóa không?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Không thể hoàn tác hành động này. Thao tác này sẽ
                            xóa vĩnh viễn bình luận của bạn và xóa dữ liệu của
                            bạn khỏi máy chủ của chúng tôi.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 text-white"
                            onClick={() => onDelete(comment._id)}
                          >
                            Tiếp tục
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
