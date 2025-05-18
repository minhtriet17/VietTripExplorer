import { getPlacePhotoUrl, GetPlacesDetails } from '@/service/GlobalAPI'
import React, { useEffect, useState } from 'react'

const HotelCardItem = ({hotel, index}) => {

    const [photoUrl, setPhotoUrl] = useState("/logo.png");
    
    
    useEffect(() => {
        if (hotel?.HotelName) {
          GetPlacePhoto();
        }
    }, [hotel]);
        
    const GetPlacePhoto = async () => {
        const data = {
          textQuery: hotel?.HotelName,
        };
    
        try {
          const result = await GetPlacesDetails(data);
          const places = result?.data?.places;
    
          if (places && places.length > 0) {
            const photos = places[0]?.photos; // Lấy danh sách ảnh của khách sạn
    
            if (photos && photos.length > 0) {
              const photoName = photos[0]?.name; // Lấy ảnh đầu tiên, có thể thay đổi index
              if (photoName) {
                const photoUrl = getPlacePhotoUrl(photoName);
                setPhotoUrl(photoUrl); // Cập nhật URL ảnh vào state
              } else {
                setPhotoUrl("/logo.png"); // Fallback nếu không có ảnh
              }
            } else {
              setPhotoUrl("/logo.png"); // Fallback nếu không có ảnh
            }
          }
        } catch (error) {
          console.error("Error fetching hotel photo:", error);
          setPhotoUrl("/logo.png"); // Fallback nếu có lỗi
        }
    };

  return (
    <div className="hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer" key={index}>
        <a
            key={index}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel?.Address + "," + hotel?.HotelName || "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer block"
        >
        <img 
          src={photoUrl}
          alt={hotel?.HotelName}
          className="w-full h-48 object-cover rounded-xl"
        />

        <div className="my-3 flex flex-col gap-2">
            <h2 className="font-medium text-md">
                 {hotel?.HotelName}
            </h2>

            <h2 className="text-xs text-gray-500">
                📍 {hotel?.Address} 
            </h2>

            <h2 className="text-sm">
                💰 {hotel?.Price}
            </h2>

            <h2 className="text-sm">
                ⭐ {hotel?.Rating}
            </h2>
        </div>
        </a>
    </div>
  )
}

export default HotelCardItem