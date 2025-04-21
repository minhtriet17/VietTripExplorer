import React from 'react'

const About = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center'>

      {/* Header section */}
      <div className="w-full bg-blue-600 text-white text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold">Về Chúng Tôi</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Khám phá sứ mệnh và tầm nhìn của dự án quảng bá du lịch Việt Nam
        </p>
      </div>

      {/* Content section */}
      <div className="w-full max-w-6xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="">
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>
              Chúng Tôi Là Ai
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4">
              Chúng tôi là một nhóm những nhà phát triển đam mê, cùng nhau xây dựng một nền tảng quảng bá và gợi ý các địa điểm du lịch độc đáo tại Việt Nam. 
              Sứ mệnh của chúng tôi là mang đến cho du khách những trải nghiệm tuyệt vời thông qua việc khám phá các điểm đến đẹp, văn hóa phong phú và ẩm thực đặc sắc.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Với sự kết hợp giữa công nghệ hiện đại và tình yêu dành cho du lịch, chúng tôi tạo ra một không gian trực tuyến giúp người dùng dễ dàng tìm kiếm, lên kế hoạch và tận hưởng hành trình của mình. 
              Đội ngũ của chúng tôi không ngừng đổi mới để mang lại những giải pháp tốt nhất cho cộng đồng yêu thích khám phá.
            </p>
          </div>

          {/* right */}
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/4057663/pexels-photo-4057663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Du lịch Việt Nam" 
              className='rounded-lg shadow-xl hover:scale-105 
              transition-transform duration-300 w-full object-cover h-80 md:h-96'  
            />
          </div>
        </div>
      </div>

       {/* Mission & Vision section */}
      <div className="w-full max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Sứ Mệnh</h3>
            <p className="text-gray-600">
              Truyền cảm hứng và hỗ trợ mọi người khám phá vẻ đẹp của Việt Nam thông qua những hành trình ý nghĩa, bền vững và trọn vẹn.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Tầm Nhìn</h3>
            <p className="text-gray-600">
              Trở thành nền tảng hàng đầu kết nối du khách với những trải nghiệm du lịch độc đáo, góp phần quảng bá văn hóa và bảo tồn tài nguyên thiên nhiên Việt Nam.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="w-full bg-blue-600 text-white text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Hãy Cùng Khám Phá!</h2>
        <p className="max-w-xl mx-auto mb-6">
          Tham gia cùng chúng tôi để khám phá những điểm đến tuyệt vời và tạo nên những kỷ niệm đáng nhớ.
        </p>
        <a 
          href="/search" 
          className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors duration-300"
        >
          Xem Địa Điểm
        </a>
      </div>
    </div>
  )
}

export default About