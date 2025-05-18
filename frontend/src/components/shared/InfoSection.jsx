import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { IoIosSend } from "react-icons/io";
import { GetPlacesDetails, getPlacePhotoUrl } from "@/service/GlobalAPI";

const InfoSection = ({ trip }) => {
  const [photoUrl, setPhotoUrl] = useState("/logo.png"); // Default to placeholder

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

        if (photos && photos.length > 0) {
          const photoName = photos[0]?.name;

          if (
            typeof photoName === "string" &&
            photoName.startsWith("places/")
          ) {
            const photoUrl = getPlacePhotoUrl(photoName);
            setPhotoUrl(photoUrl);
          } else {
            setPhotoUrl("/logo.png");
          }
        } else {
          setPhotoUrl("/logo.png");
        }
      } else {
        setPhotoUrl("/logo.png");
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
      setPhotoUrl("/logo.png");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
          <h2 className="font-bold text-2xl">{trip?.location?.displayName}</h2>

          <div className="flex gap-5 items-center">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              📅 {trip?.noOfDays} Ngày
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              📅 Bắt đầu từ ngày {formatDate(trip?.startDate)} và kết thúc ngày {formatDate(trip?.endDate)}
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              💰 Chi tiêu: {trip?.budget}
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              🥂 Số người: {trip?.traveler}
            </h2>
          </div>
        </div>

        <Button>
          <IoIosSend />
        </Button>
      </div>
    </div>
  );
};

export default InfoSection;
