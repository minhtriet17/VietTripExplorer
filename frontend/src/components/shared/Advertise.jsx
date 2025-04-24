import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Advertise = () => {
  return (
    <div
      className="flex flex-col md:flex-row p-4 md:p-6 border border-teal-600
    justify-center items-center rounded-tl-3xl rounded-br-3xl text-center"
    >
      <div className="flex-1 justify-center flex flex-col p-3 w-full md:w-3/5">
        <h2 className="text-xl md:text-2xl font-semibold text-wrap text-gray-800">
          Muốn biết thêm các tin tức về du lịch của ngày hôm nay{" "}
          <span className="text-red-600">Top 10 </span>tin tức?
        </h2>

        <p className="text-gray-500 my-4 md:my-6">
          Xem ngay các bài viết tin tức hàng đầu và cập nhật xu hướng du lịch
          mới nhất.
        </p>

        <Button
          variant="outline"
          className="bg-blue-500 border border-slate-500 text-md mt-3 py-2 px-6 rounded-lg hover:bg-blue-400 transition duration-300"
        >
          <Link
            to={"https://google.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold"
          >
            Cập nhật với Top 10 Tin tức
          </Link>
        </Button>
      </div>
      <div className="p-5 w-full md:w-2/5 flex justify-center">
        <img
          src="https://images.pexels.com/photos/3944454/pexels-photo-3944454.jpeg?auto=compress&cs=tinysrgb&w=300"
          alt="Tin tức du lịch"
          className="w-full object-cover rounded-xl shadow-md"
        />
      </div>
    </div>
  );
};

export default Advertise;
