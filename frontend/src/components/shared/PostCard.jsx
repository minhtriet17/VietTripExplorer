import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white hover:shadow-2xl transition-all duration-300 ease-in-out rounded-lg w-full sm:w-[330px] border border-gray-300">
      {/* link wrapping the image */}
      <Link
        to={`/post/${post.slug}`}
        className="block h-[250px] w-full overflow-hidden"
      >
        <img
          src={post.image}
          alt="post cover"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 bg-gray-200"
        />
      </Link>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-3">
        {/* Post title */}
        <p className="text-lg sm:text-xl font-semibold line-clamp-2 text-slate-800 hover:text-blue-600 transition-colors duration-200">
          {post.title}
        </p>

        {/* Post category */}
        <span className="italic text-sm text-slate-600">{post.category}</span>

        {/* Read Article button */}
        <Link
          to={`/post/${post.slug}`}
          className="mt-4 py-2 px-4 text-center rounded-md border border-transparent text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
        >
          Đọc Bài Viết
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
