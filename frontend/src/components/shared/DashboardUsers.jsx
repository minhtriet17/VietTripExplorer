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
import { Button } from "../ui/button";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const DashboardUsers = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);

  // console.log(users)

  const [showMore, setShowMore] = useState(true);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = currentUser.token;
        const res = await fetch(`/api/user/getusers`, {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);

          if (data.users.length < 1) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
    } else {
      console.log("User does not have admin privileges");
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;

    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);

        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full px-3 py-5 flex flex-col items-center justify-center">
      {currentUser.isAdmin && users.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[640px]">
            <TableCaption className="text-base font-semibold mb-3">
              Danh sách người dùng đã đăng ký
            </TableCaption>

            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-slate-800">
                <TableHead className="w-[160px] text-sm">
                  Tham gia vào
                </TableHead>
                <TableHead className="text-sm">Ảnh đại diện</TableHead>
                <TableHead className="text-sm">Tên người dùng</TableHead>
                <TableHead className="text-sm">Email</TableHead>
                <TableHead className="text-sm">Admin</TableHead>
                <TableHead className="text-sm">Xóa</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y dark:divide-slate-600">
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-slate-600 bg-gray-200 dark:bg-slate-700"
                    />
                  </TableCell>

                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </TableCell>

                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {user.email}
                  </TableCell>

                  <TableCell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-600" />
                    ) : (
                      <RxCross2 className="text-red-600" />
                    )}
                  </TableCell>

                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span
                          onClick={() => setUserIdToDelete(user._id)}
                          className="text-red-500 hover:underline cursor-pointer text-sm font-medium"
                        >
                          Xóa
                        </span>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="dark:bg-slate-800 dark:text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Bạn có chắc chắn không?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này sẽ xóa vĩnh viễn người dùng khỏi hệ
                            thống và không thể khôi phục.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 text-white"
                            onClick={handleDeleteUser}
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

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-blue-700 dark:text-blue-400 text-sm text-center py-5 hover:underline"
            >
              Hiển thị thêm
            </button>
          )}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300 mt-5">
          Chưa có ai đăng ký
        </p>
      )}
    </div>
  );
};

export default DashboardUsers;
