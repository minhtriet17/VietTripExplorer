import React from 'react'
import { BrowserRouter, Link } from 'react-router-dom'

const NavBar = () => {
    const menus = [
        {title: "Trang Chủ", url: "/"},
        {title: "Giới Thiệu", url: "/about"},
        {title: "Tin Tức", url: "/news"},
        {title: "Tạo hành trình", url: "/contact"},
        {title: "Đăng Nhập", url: "/sign-in"}
    ]
  return (
    <BrowserRouter>
        <nav className='flex justify-between items-center px-[140px] py-5'>
            <a href=""><img src="" alt="" /></a>

            <div className="bg-[#4A8087] bg-opacity-[70%] py-3 px-[80px] rounded-[40px]">
                <ul className='flex text-white text-[17px] font-bold uppercase gap-[120px]'>
                    {
                        menus.map((menu, i) => (
                            <li key={i}>
                                <Link 
                                    to={menu.url}
                                    spy={true}
                                    smooth={true}
                                    offset={50}
                                    duration={500}
                                    className='hover:border-b-2 border-white transform duration-150 cursor-pointer'
                                >
                                    {menu.title}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>

        </nav>
    </BrowserRouter>
  )
}

export default NavBar