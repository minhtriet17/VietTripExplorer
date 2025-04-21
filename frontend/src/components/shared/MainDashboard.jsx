import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardCard from "./DashboardCard";
import { formatDateAdvanced } from "@/lib/utils";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const MainDashboard = () => {
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  // console.log(user, posts, comments)

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");

        const data = await res.json();

        if (res.ok) {
          setUser(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log("Error fetching users:", error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5");

        const data = await res.json();

        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5");

        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);
  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <DashboardCard
          title="Tất cả người dùng"
          description={`${formatDateAdvanced(currentUser.createdAt)} 
                - ${formatDateAdvanced(Date.now())}`}
          chartData={[{ value: totalUsers, fill: "blue" }]}
          chartConfig={{
            users: { label: "Users" },
          }}
          totalValue={totalUsers}
          lastMonthValue={lastMonthUsers}
          footerText={"Hiển thị tổng số người dùng mọi lúc"}
          endAngle={250}
        />

        <DashboardCard
          title="Tất cả bình luận"
          description={`${formatDateAdvanced(currentUser.createdAt)} 
                - ${formatDateAdvanced(Date.now())}`}
          chartData={[{ value: totalUsers, fill: "orange" }]}
          chartConfig={{
            users: { label: "Users" },
          }}
          totalValue={totalComments}
          lastMonthValue={lastMonthComments}
          footerText={"Hiển thị tất cả bình luận mọi lúc"}
          endAngle={160}
        />

        <DashboardCard
          title="Tất cả bài viết"
          description={`${formatDateAdvanced(currentUser.createdAt)} 
                - ${formatDateAdvanced(Date.now())}`}
          chartData={[{ value: totalUsers, fill: "green" }]}
          chartConfig={{
            users: { label: "Users" },
          }}
          totalValue={totalPosts}
          lastMonthValue={lastMonthPosts}
          footerText={"Hiển thị tất cả bài viết"}
          endAngle={110}
        />
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-[300px] shadow-md p-2 rounded-md">
          <div className="flex justify-between items-center p-4 text-sm font-semibold">
            <h1 className="text-center p-2 text-lg font-bold text-slate-700 flex-1">
              Người dùng gần đây
            </h1>

            <Button className="px-4 py-2 text-white rounded-md transition duration-200">
              <Link to={"/dashboard?tab=users"} className="block">
                Xem tất cả
              </Link>
            </Button>
          </div>

          <Table>
            <TableCaption>Danh sách những người dùng gần đây.</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead >Ảnh</TableHead>
                <TableHead>Tên người dùng</TableHead>
              </TableRow>
            </TableHeader>

            {user.map((user) => (
              <TableBody className="divide-y" key={user._id}>
                <TableRow>
                  <TableCell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-200 rounded-full"
                    />
                  </TableCell>
                  <TableCell className="w-32">{user.username}</TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-[450px] shadow-md p-2 rounded-md">
          <div className="flex justify-between items-center p-3 text-sm font-semibold">
            <h1 className="text-center p-2 text-xl font-bold text-slate-700">
              Các bình luận gần đây
            </h1>

            <Button>
              <Link to={"/dashboard?tab=comments"}>Xem tất cả</Link>
            </Button>
          </div>

          <Table>
            <TableCaption>Danh sách các bình luận gần đây.</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Bình luận</TableHead>
                <TableHead>Likes</TableHead>
              </TableRow>
            </TableHeader>

            {comments.map((comment) => (
              <TableBody className="divide-y" key={comment._id}>
                <TableRow>
                  <TableCell className="w-96">
                    <p className="line-clamp-2">{comment.content}</p>
                  </TableCell>
                  <TableCell>{comment.numberOfLikes}</TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-[450px] shadow-md p-2 rounded-md">
          <div className="flex justify-between items-center p-3 text-sm font-semibold">
            <h1 className="text-center p-2 text-xl font-bold text-slate-700">
              Recent Posts
            </h1>

            <Button>
              <Link to={"/dashboard?tab=posts"}>See All</Link>
            </Button>
          </div>

          <Table>
            <TableCaption>A list of your recent posts.</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Post image</TableHead>
                <TableHead>Post title</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>

            {posts &&
              posts.map((post) => (
                <TableBody className="divide-y" key={post._id}>
                  <TableRow>
                    <TableCell>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-10 h-10 object-cover bg-gray-200
                                            rounded-full"
                      />
                    </TableCell>
                    <TableCell className="w-80">{post.title}</TableCell>
                    <TableCell className="w-5">{post.category}</TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
