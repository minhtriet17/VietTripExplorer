import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
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

const DashboardPosts = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [userPosts, setUserPosts] = useState([]);

  // console.log(userPosts)

  const [showMore, setShowMore] = useState(true);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);

        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);

          if (data.posts.length < 1) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;

    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );

      const data = await res.json();

      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);

        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    // console.log(postIdToDelete)
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-full p-3">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <div className="overflow-x-auto w-full">
            <Table className="min-w-full">
              <TableCaption>Danh Sách Các Bài Viết</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] text-sm sm:text-base">
                    Ngày cập nhật
                  </TableHead>
                  <TableHead className="text-sm sm:text-base">
                    Hình ảnh bài viết
                  </TableHead>
                  <TableHead className="text-sm sm:text-base">
                    Tiêu đề bài viết
                  </TableHead>
                  <TableHead className="text-sm sm:text-base">
                    Loại bài viết
                  </TableHead>
                  <TableHead className="text-sm sm:text-base">Xóa</TableHead>
                  <TableHead className="text-sm sm:text-base">Sửa</TableHead>
                </TableRow>
              </TableHeader>

              {userPosts.map((post) => (
                <TableBody className="divide-y" key={post._id}>
                  <TableRow>
                    <TableCell className="text-sm sm:text-base">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-16 h-16 sm:w-20 sm:h-10 object-cover bg-gray-500 rounded-md"
                        />
                      </Link>
                    </TableCell>

                    <TableCell className="text-sm sm:text-base">
                      <Link
                        to={`/post/${post.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        {post.title}
                      </Link>
                    </TableCell>

                    <TableCell className="text-sm sm:text-base">
                      {post.category}
                    </TableCell>

                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <span
                            onClick={() => setPostIdToDelete(post._id)}
                            className="font-medium text-red-500 hover:underline cursor-pointer"
                          >
                            Xóa
                          </span>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Bạn có chắc chắn muốn xóa bài viết này không?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa
                              bài viết này không? Điều này sẽ xóa bài viết khỏi danh sách
                              của bạn và không thể khôi phục lại.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600"
                              onClick={handleDeletePost}
                            >
                              Tiếp tục
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>

                    <TableCell>
                      <Link
                        to={`/update-post/${post._id}`}
                        className="font-medium text-green-600 hover:underline cursor-pointer text-sm sm:text-base"
                      >
                        Chỉnh sửa
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
          </div>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-blue-700 text-sm py-4 sm:py-6 cursor-pointer mt-4"
            >
              Hiển thị thêm
            </button>
          )}
        </>
      ) : (
        <p className="text-gray-500">Bạn chưa có bài viết nào</p>
      )}
    </div>
  );
};

export default DashboardPosts;
