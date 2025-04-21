import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const DashboardComments = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);

  console.log(comments);

  const [showMore, setShowMore] = useState(true);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);

        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);

          if (data.comments.length < 1) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;

    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );

      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);

        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setCommentIdToDelete("");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full px-4 py-6">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          {/* Table for medium and up */}
          <div className="overflow-x-auto rounded-lg shadow-md">
            <div className="hidden md:block min-w-[800px]">
              <Table className="w-full text-sm text-left text-gray-700">
                <TableCaption className="text-lg font-semibold text-center mb-4">
                  Danh sách các bình luận của người dùng
                </TableCaption>

                <TableHeader className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <TableRow>
                    <TableHead className="min-w-[140px]">
                      Ngày cập nhật
                    </TableHead>
                    <TableHead className="min-w-[200px]">Bình luận</TableHead>
                    <TableHead className="min-w-[100px]">Lượt thích</TableHead>
                    <TableHead className="min-w-[120px]">Post ID</TableHead>
                    <TableHead className="min-w-[120px]">User ID</TableHead>
                    <TableHead className="min-w-[80px] text-center">
                      Xoá
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y">
                  {comments.map((comment) => (
                    <TableRow key={comment._id} className="hover:bg-gray-50">
                      <TableCell>
                        {new Date(comment.updatedAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="whitespace-normal break-words">
                        {comment.content}
                      </TableCell>

                      <TableCell>{comment.numberOfLikes}</TableCell>
                      {/* PostId và UserId chỉ hiển thị trên màn hình lớn */}
                      <TableCell className="hidden sm:table-cell">
                        {comment.postId}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {comment.userId}
                      </TableCell>

                      <TableCell className="text-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <span
                              onClick={() => setCommentIdToDelete(comment._id)}
                              className="text-red-500 hover:underline cursor-pointer"
                            >
                              Xoá
                            </span>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bạn có chắc chắn không?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Hành động này không thể hoàn tác. Bình luận sẽ
                                bị xoá vĩnh viễn.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Huỷ</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600"
                                onClick={handleDeleteComment}
                              >
                                Tiếp tục
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Card layout for small screens */}
          <div className="md:hidden space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="p-4 border rounded-lg shadow-sm bg-white space-y-2"
              >
                <div className="text-xs text-gray-500">
                  Cập nhật: {new Date(comment.updatedAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-800 whitespace-pre-wrap">
                  {comment.content}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span>👍 {comment.numberOfLikes}</span>
                  <span className="truncate">📝 Post ID: {comment.postId}</span>
                  <span className="truncate">👤 User ID: {comment.userId}</span>
                </div>
                <div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <span
                        onClick={() => setCommentIdToDelete(comment._id)}
                        className="text-sm text-red-500 hover:underline cursor-pointer"
                      >
                        Xoá bình luận
                      </span>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Bạn có chắc chắn không?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác. Bình luận sẽ bị xoá
                          vĩnh viễn.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600"
                          onClick={handleDeleteComment}
                        >
                          Tiếp tục
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-blue-600 hover:text-blue-800 font-medium py-4 text-sm mt-6 transition"
            >
              Xem thêm
            </button>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">Chưa có bình luận nào.</p>
      )}
    </div>
  );
};

export default DashboardComments;
