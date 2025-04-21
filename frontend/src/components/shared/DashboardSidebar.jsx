import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaComments, FaUserAlt, FaUsers, FaBars, FaSignOutAlt } from "react-icons/fa";
import { signOutSuccess } from "@/redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoIosCreate, IoIosDocument } from "react-icons/io";
import { MdDashboardCustomize } from "react-icons/md";

const SidebarItem = ({ to, icon: Icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
      ${isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`}
  >
    <Icon className="text-lg" />
    {label}
  </Link>
);

const DashboardSidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const getActiveTab = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("tab");
  };

  const activeTab = getActiveTab();

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) console.log(data.message);
      else dispatch(signOutSuccess());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden p-4 bg-white border-b flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-slate-700">
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 shadow-md flex flex-col transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static
      `}>
        {/* Header */}
        <div className="p-6 flex items-center justify-center border-b border-slate-200">
          <h1 className="text-xl font-extrabold text-blue-600">VIETTRIP EXPLORER</h1>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {currentUser?.isAdmin && (
            <SidebarItem
              to="/dashboard?tab=dashboard"
              icon={MdDashboardCustomize}
              label="Bảng điều khiển"
              isActive={activeTab === "dashboard"}
            />
          )}
          <SidebarItem
            to="/dashboard?tab=profile"
            icon={FaUserAlt}
            label="Thông tin cá nhân"
            isActive={activeTab === "profile"}
          />
          {currentUser?.isAdmin && (
            <>
              <SidebarItem
                to="/create-post"
                icon={IoIosCreate}
                label="Tạo bài viết"
                isActive={location.pathname === "/create-post"}
              />
              <SidebarItem
                to="/dashboard?tab=posts"
                icon={IoIosDocument}
                label="Quản lý bài viết"
                isActive={activeTab === "posts"}
              />
              <SidebarItem
                to="/dashboard?tab=users"
                icon={FaUsers}
                label="Quản lý người dùng"
                isActive={activeTab === "users"}
              />
              <SidebarItem
                to="/dashboard?tab=comments"
                icon={FaComments}
                label="Quản lý bình luận"
                isActive={activeTab === "comments"}
              />
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleSignout}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition"
          >
            <FaSignOutAlt className="text-lg" />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
