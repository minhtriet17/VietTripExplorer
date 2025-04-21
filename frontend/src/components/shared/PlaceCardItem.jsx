import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { FaMapLocationDot } from "react-icons/fa6";
import { GetPlacesDetails, PHOTO_REF_URL } from '@/service/GlobalAPI';

const PlaceCardItem = ({ plan }) => {
  const [photoUrl, setPhotoUrl] = useState("/PlaceHolder.png"); // Default to placeholder
  
  
  useEffect(() => {
    if (plan?.PlaceName) {
      GetPlacePhoto();
    }
  }, [plan]);
      
  const GetPlacePhoto = async () => {
    const data = {
      textQuery: plan?.PlaceName,
    };

    try {
      const result = await GetPlacesDetails(data);
      const places = result?.data?.places;

      if (places && places.length > 0) {
        const photos = places[0]?.photos; // Lấy danh sách ảnh của địa điểm

        if (photos && photos.length > 0) {
          const photoName = photos[0]?.name; // Lấy ảnh đầu tiên, có thể thay đổi index
          if (photoName) {
            const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
            setPhotoUrl(photoUrl); // Cập nhật URL ảnh vào state
          } else {
            setPhotoUrl("/PlaceHolder.png"); // Fallback nếu không có ảnh
          }
        } else {
          setPhotoUrl("/PlaceHolder.png"); // Fallback nếu không có ảnh
        }
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
      setPhotoUrl("/PlaceHolder.png"); // Fallback nếu có lỗi
    }
  };
  return (
    <div className="border rounded-xl p-4 flex flex-col hover:scale-105 transition-all hover:shadow duration-200 ease-in-out cursor-pointer h-full">
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plan?.PlaceName || "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <div className="flex flex-col justify-between h-full">
          {/* Image */}
          <img
            src={photoUrl} // Chỉ dùng photoUrl, đã có fallback
            className="w-full h-[250px] object-cover rounded-xl mb-4"
            alt="Place"
          />

          {/* Nội dung */}
          <div className="flex flex-col flex-grow justify-between h-full">
            <div>
              <h2 className="font-bold text-lg">{plan?.PlaceName}</h2>
              <p className="text-sm text-gray-400 mt-1 line-clamp-4">
                {plan?.Details}
              </p>
              <h2 className="mt-2 text-sm text-gray-500">
                🕙 {plan?.EstimatedDuration}
              </h2>
            </div>

            {/* Nút ở dưới cùng */}
            <div className="mt-4">
              <Button size={"sm"} variant="outline" className="w-full">
                <FaMapLocationDot />
              </Button>
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

export default PlaceCardItem
