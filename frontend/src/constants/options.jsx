export const SelectTravelesList=[
    {
        id:1,
        title:'Chỉ mình tôi',
        desc:'Một du khách đơn độc đang tìm kiếm cuộc phiêu lưu và khám phá bản thân.',
        icon:'👤',
        people:'1 người'
    },
    {
        id:2,
        title:'Một cặp đôi',
        desc:'Một cặp đôi đang tìm kiếm một kỳ nghỉ lãng mạn hoặc phiêu lưu cùng nhau.',
        icon:'🥂',
        people:'2 người'
    },
    {
        id:3,
        title:'Gia đình',
        desc:'Một gia đình đang tìm kiếm một kỳ nghỉ vui vẻ và đáng nhớ cùng nhau.',
        icon:'🏡',
        people:'4 người'
    },
    {
        id:4,
        title:'Bạn bè',
        desc:'Một nhóm bạn đang tìm kiếm một chuyến đi vui vẻ và phiêu lưu cùng nhau.',
        icon:'👯‍♀️',
        people:'3 tới 5 người'
    },
    
]

export const SelectBudgetOptions = [
    {
        id:1,
        title:'Rẻ',
        desc:'Một lựa chọn tiết kiệm cho những người muốn khám phá mà không tốn quá nhiều tiền.',
        icon:'🪙',
    },
    {
        id:2,
        title:'Bình dân',
        desc:'Một lựa chọn hợp lý cho du khách muốn có trải nghiệm tốt mà không tốn quá nhiều tiền.',
        icon:'💰',
    },
    {
        id:3,
        title:'Sang trọng',
        desc:'Một lựa chọn cao cấp cho những người muốn tận hưởng sự sang trọng và thoải mái.',
        icon:'👑',
    },
]

//export const AI_PROMPT = "Generate Travel Plan for Location: {location},for {totalDays} Days for {traveler} with a {budget} budget, give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format."

export const AI_PROMPT = "Tạo Kế hoạch Du lịch cho Địa điểm: {location}, trong {totalDays} Ngày cho {traveler} với ngân sách {budget}, cung cấp cho tôi danh sách các tùy chọn Khách sạn với HotelName, Địa chỉ Khách sạn, Giá, URL hình ảnh khách sạn, tọa độ địa lý, xếp hạng, mô tả và đề xuất hành trình với PlaceName, Chi tiết Địa điểm, URL Hình ảnh Địa điểm (chỉ sử dụng hình ảnh thực tế từ các nguồn đáng tin cậy như Wikimedia, Wikipedia, Tripadvisor, Booking.com, Agoda hoặc các trang chính thức), Tọa độ Địa lý, Giá vé, Du hành thời gian của từng địa điểm trong {totalDays} ngày với kế hoạch cho từng ngày cùng thời điểm tốt nhất để ghé thăm theo định dạng JSON. Hãy chỉ trả về kết quả ở định dạng JSON thuần, không có bất kỳ giải thích hoặc chú thích nào. Không sử dụng comment (// hoặc /* */). Các key đều phải nằm trong dấu ngoặc kép. Tất cả các thông tin cần được cung cấp bằng tiếng Việt."

// export const AI_PROMPT = "Tạo kế hoạch du lịch cho địa điểm: {location}, trong {totalDays} ngày cho {traveler} với ngân sách {budget}. Cung cấp danh sách các tùy chọn khách sạn, mỗi khách sạn bao gồm: HotelName, Address, Price, Rating, Description; Coordinates (latitude, longitude); ImageUrl: phải là đường dẫn hợp lệ, ví dụ từ Unsplash hoặc ảnh placeholder (https://source.unsplash.com/... hoặc https://via.placeholder.com/...), Cung cấp lịch trình du lịch theo từng ngày (day 1, day 2, ...) gồm: Theme của ngày, danh sách các điểm đến trong ngày đó. Mỗi điểm đến gồm: Time, PlaceName, Details, ImageUrl: phải là đường dẫn ảnh hợp lệ (như trên), Coordinates, EstimatedDuration, TicketPrice. Kết quả cần được trả về dưới dạng JSON hợp lệ."