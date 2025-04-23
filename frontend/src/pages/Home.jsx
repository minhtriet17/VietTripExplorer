import Advertise from "@/components/shared/Advertise";
import PostCard from "@/components/shared/PostCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  // console.log(posts)

  useEffect(() => {
    // Fetch posts from the API
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getPosts?limit=3");

      const data = await res.json();

      if (res.ok) {
        setPosts(data.posts);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-400 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center md:text-left md:max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
              Khám Phá <span className="text-yellow-400">VietTripExplorer</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-100">
              Khám phá những điểm đến du lịch tuyệt vời nhất Việt Nam với các
              gợi ý thú vị.
            </p>
            <p className="mt-2 text-sm sm:text-base italic text-gray-200">
              Cùng bắt đầu hành trình du lịch của bạn ngay hôm nay!
            </p>
            <Link to="/search">
              <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-6 sm:py-4 sm:px-8 rounded-full font-semibold shadow-lg flex items-center gap-2 mx-auto md:mx-0 transition ease-in-out duration-300 transform hover:scale-105">
                Khám Phá Ngay
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 sm:mb-12">
            Tại Sao Chọn VietTripExplorer?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
            <FeatureCard
              title="Đa Dạng Điểm Đến"
              description="Khám phá những địa điểm du lịch tuyệt vời từ miền Bắc đến miền Nam."
              icon="🗺️"
            />
            <FeatureCard
              title="Cộng Đồng Đam Mê"
              description="Chia sẻ kinh nghiệm và kết nối với cộng đồng yêu du lịch."
              icon="🤝"
            />
            <FeatureCard
              title="Dễ Dàng Sử Dụng"
              description="Giao diện đơn giản, giúp bạn lên kế hoạch một cách nhanh chóng."
              icon="⚡"
            />
          </div>
        </div>
      </section>

      {/* Advertisement Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-64 sm:h-80 md:h-96 flex items-center justify-center bg-white rounded-lg shadow-md overflow-hidden">
            <Advertise />
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts && posts.length > 0 && (
            <div className="flex flex-col gap-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 text-center sm:text-left">
                Bài Viết Gần Đây
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Link
                to="/search"
                className="text-base sm:text-lg text-blue-600 hover:underline font-semibold text-center block mt-6"
              >
                Xem Tất Cả Bài Viết
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div
      className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg
      transition-shadow duration-300 text-center"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Home;
