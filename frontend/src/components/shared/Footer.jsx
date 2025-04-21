import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='bg-gray-800 text-white py-8'>
        <div className="container mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Us */}
            <div >
                <h2 className="text-lg font-semibold mb-4">Về chúng tôi</h2>
                <p className='text-gray-400 text-sm'>
                    Chào mừng bạn đến với VietTripExplorer - 
                    nơi chúng tôi chia sẻ những gợi ý và thông tin hữu ích về các địa điểm du lịch tuyệt vời tại Việt Nam. 
                    Sứ mệnh của chúng tôi là giúp bạn khám phá vẻ đẹp tiềm ẩn của đất nước, từ những bãi biển thơ mộng, 
                    núi non hùng vĩ đến các di sản văn hóa độc đáo. 
                    Hãy cùng chúng tôi lên kế hoạch cho hành trình đáng nhớ của bạn!
                </p>
            </div>

            {/* Quick Links */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Liên kết nhanh</h2>

                <ul className='space-y-2 text-gray-400'>
                    <li>
                        <Link to={"/"} className='hover:text-white'>Trang chủ</Link>
                    </li>

                    <li>
                        <Link to={"/about"} className='hover:text-white'>Thông tin về chúng tôi</Link>
                    </li>

                    <li>
                        <Link to={"/news"} className='hover:text-white'>Tin Tức Mới</Link>
                    </li>

                    {/* <li>
                        <Link to={"/contact"} className='hover:text-white'>Contact Us</Link>
                    </li> */}
                </ul>
            </div>
            {/* Contact Us */}
            <div>
                <h2 className='text-lg font-semibold mb-4'>Liên hệ với chúng tôi</h2>

                <p className="text-gray-400 text-sm"> 69/68 Đ. Đặng Thuỳ Trâm, Phường 13, Bình Thạnh, Hồ Chí Minh</p>

                <p className="text-gray-400 text-sm"> Email: vlu@gmail.com</p>

                <p className="text-gray-400 text-sm"> Phone: +84 123456789 </p>
            </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500
        text-sm">
            <p>Theo dõi: </p>

            <div className="flex justify-center space-x-4 mt-3">
                <a href="#" className='hover:text-white'>
                    Facebook
                </a>

                <a href="#" className='hover:text-white'>
                    Twitter
                </a>

                <a href="#" className='hover:text-white'>
                    LinkedIn
                </a>

                <a href="#" className='hover:text-white'>
                    Instagram
                </a>
            </div>

            <p className='mt-4'>&copy; {new Date().getFullYear()} VietTrip Explorer. All rights</p>
        </div>
    </div>
  )
}

export default Footer