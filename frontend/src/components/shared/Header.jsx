import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaSearch, FaBars } from "react-icons/fa";
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOutSuccess } from '@/redux/user/userSlice';

const Header = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const { currentUser } = useSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm")
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" })
      const data = await res.json()
      if (!res.ok) console.log(data.message)
      else dispatch(signOutSuccess())
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`)
  }

  return (
    <header className='shadow-md sticky top-0 z-50 bg-white'>
      <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-y-3'>

        {/* Logo */}
        <Link to={"/"}>
          <h1 className='font-bold text-xl sm:text-2xl flex flex-wrap items-center gap-1'>
            <span className='text-slate-500'>VIETTRIP</span>
            <span className='text-slate-900'>EXPLORER</span>
          </h1>
        </Link>

        {/* Search */}
        <form
          className='flex items-center bg-slate-100 rounded-lg px-3 py-1 w-full sm:w-auto sm:flex-grow max-w-md'
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder='Tìm kiếm...'
            className='flex-1 bg-transparent focus:outline-none text-sm py-1'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className='text-slate-500' />
          </button>
        </form>

        {/* Navigation */}
        <div className='flex items-center gap-4'>
          <div className='hidden lg:flex gap-4 text-slate-700 text-sm font-medium'>
            <Link to={"/"} className='hover:underline'>Trang Chủ</Link>
            <Link to={"/about"} className='hover:underline'>Về Chúng Tôi</Link>
            <Link to={"/news"} className='hover:underline'>Blog</Link>
            <Link to={"/create-trip"} className='hover:underline'>Tạo Lịch Trình</Link>
            <Link to={"/plans"} className='hover:underline'>Lịch Trình Của Tôi</Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <button className='block lg:hidden' onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars className='text-xl text-gray-700' />
          </button>

          {/* User Avatar / Sign in */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={currentUser.profilePicture}
                  alt="user"
                  className='w-10 h-10 rounded-full object-cover cursor-pointer'
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60">
                <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className='flex flex-col text-sm'>
                    <span className='font-semibold'>@{currentUser.username}</span>
                    <span className='text-xs text-gray-500'>{currentUser.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/dashboard?tab=profile" className='w-full'>Hồ sơ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignout}>Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={"/Sign-in"}>
              <Button size="sm">Đăng nhập</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className='w-full flex flex-col gap-3 mt-3 lg:hidden text-slate-700 text-sm font-medium'>
            <Link to={"/"} className='hover:underline'>Trang Chủ</Link>
            <Link to={"/about"} className='hover:underline'>Về Chúng Tôi</Link>
            <Link to={"/news"} className='hover:underline'>Blog</Link>
            <Link to={"/create-trip"} className='hover:underline'>Tạo Lịch Trình</Link>
            <Link to={"/plans"} className='hover:underline'>Lịch Trình Của Tôi</Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
