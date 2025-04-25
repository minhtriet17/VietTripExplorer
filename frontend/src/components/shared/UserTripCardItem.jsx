import { GetPlacesDetails, getPlacePhotoUrl } from "@/service/GlobalAPI";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, CalendarDays } from "lucide-react";

const UserTripCardItem = ({ plan }) => {
  const [photoUrl, setPhotoUrl] = useState("/PlaceHolder.png");

  useEffect(() => {
    if (plan?.location?.displayName) {
      GetPlacePhoto();
    }
  }, [plan]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: plan?.location?.displayName,
    };

    try {
      const result = await GetPlacesDetails(data);
      const places = result?.data?.places;

      if (places && places.length > 0) {
        const photos = places[0]?.photos;

        if (photos && photos.length > 0) {
          const photoName = photos[0]?.name; // Lấy ảnh đầu tiên, có thể thay đổi index
          if (photoName) {
            const photoUrl = getPlacePhotoUrl(photoName);
            setPhotoUrl(photoUrl); // Cập nhật URL ảnh vào state
          } else {
            setPhotoUrl("/PlaceHolder.png"); // Fallback nếu không có ảnh
          }
        } else {
          setPhotoUrl("/PlaceHolder.png"); // Fallback nếu không có ảnh
        }
      }
    } catch (error) {
      console.error("Error fetching hotel photo:", error);
      setPhotoUrl("/PlaceHolder.png"); // Fallback nếu có lỗi
    }
  };

  const getBudgetColor = (budget) => {
    if (!budget) return "bg-gray-300";
    if (budget.includes("Rẻ")) return "bg-red-100 text-red-600";
    if (budget.includes("Bình dân")) return "bg-yellow-100 text-yellow-600";
    if (budget.includes("Sang trọng")) return "bg-green-100 text-green-600";
    return "bg-gray-200 text-gray-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative group">
        <img
          src={photoUrl || "/PlaceHolder.png"}
          alt="Place"
          className="h-48 sm:h-56 md:h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Link
          to={`/view-trip/${plan.slug}`}
          state={{ trip: plan }}
          className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-sm px-3 py-1 rounded-full text-blue-600 font-medium shadow hover:bg-opacity-100 transition"
        >
          Chi tiết
        </Link>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="mb-2">
          <h2 className="font-semibold text-lg sm:text-xl text-gray-800 mb-1 truncate">
            {plan?.location?.displayName}
          </h2>

          <div className="flex items-center text-sm text-gray-600 gap-2 mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>{plan?.noOfDays} ngày</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 gap-2">
            <MapPin className="w-4 h-4" />
            <span>{plan?.location?.displayName}</span>
          </div>
        </div>

        <div className="mt-auto">
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getBudgetColor(
              plan?.budget
            )}`}
          >
            {plan?.budget || "Không xác định"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserTripCardItem;
