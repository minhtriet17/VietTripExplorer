import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { IoIosSend } from 'react-icons/io'
import { GetPlacesDetails, PHOTO_REF_URL } from '@/service/GlobalAPI';

const InfoSection = ({trip}) => {

    const [photoUrl, setPhotoUrl] = useState("/PlaceHolder.png"); // Default to placeholder


    useEffect(() => {
        if (trip?.location?.displayName) {
          GetPlacePhoto();
        }
      }, [trip]);
    
    const GetPlacePhoto = async () => {
        const data = {
          textQuery: trip?.location?.displayName,
        };
    
        try {
          const result = await GetPlacesDetails(data);
          const places = result?.data?.places;
    
          if (places && places.length > 0) {
            const photos = places[0]?.photos;
    
            if (photos && photos.length > 3) {
              const photoName = photos[3]?.name; // Lấy ảnh thứ 4 nếu có
              if (photoName) {
                const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
                setPhotoUrl(photoUrl); // Cập nhật URL ảnh
              } else {
                setPhotoUrl("/PlaceHolder.png"); // Fallback nếu không có ảnh
              }
            } else {
              setPhotoUrl("/PlaceHolder.png"); // Fallback nếu không có ảnh đủ
            }
          } else {
            setPhotoUrl("/PlaceHolder.png"); // Fallback nếu không có địa điểm
          }
        } catch (error) {
          console.error("Error fetching place photo:", error);
          setPhotoUrl("/PlaceHolder.png"); // Fallback nếu có lỗi
        }
    };

  return (
    <div>
        <img
            src={photoUrl} // Dùng photoUrl, đã có fallback
            className="h-[340px] w-full object-cover rounded-xl"
            alt="Place"
        />

        <div className="flex justify-between items-center">
            <div className="my-5 flex flex-col gap-2">
                <h2 className='font-bold text-2xl'>{trip?.location?.displayName}</h2>

                <div className="flex gap-5 items-center">
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
                        📅 {trip?.noOfDays} Days
                    </h2>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
                        💰 {trip?.budget} Budgets
                    </h2>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
                        🥂 No. Of Traveler: {trip?.traveler} 
                    </h2>
                </div>
            </div>

            <Button><IoIosSend /></Button>
        </div>
        
    </div>
  )
}

export default InfoSection