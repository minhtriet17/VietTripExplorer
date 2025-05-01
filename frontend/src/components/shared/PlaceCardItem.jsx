import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { FaMapLocationDot } from "react-icons/fa6";
import { getPlacePhotoUrl, GetPlacesDetails} from '@/service/GlobalAPI';

const PlaceCardItem = ({ plan }) => {
  const [photoUrl, setPhotoUrl] = useState("/logo.png"); // Default to placeholder
  
  
  useEffect(() => {
    if (plan?.PlaceName) {
      GetPlacePhoto();
    }
  }, [plan]);
      
  const GetPlacePhoto = async () => {
    const hasCoordinates = !!(plan?.Coordinates?.latitude && plan?.Coordinates?.longitude);
  
    const data = {
      textQuery: `${plan?.PlaceName}, Việt Nam`,
      ...(hasCoordinates && {
        locationBias: {
          circle: {
            center: {
              latitude: plan.Coordinates.latitude,
              longitude: plan.Coordinates.longitude,
            },
            radius: 3000,
          },
        },
      }),
    };
  
    try {
      const result = await GetPlacesDetails(data);
      const place = result?.data?.places?.[0];
  
      const photoName = place?.photos?.[0]?.name;
      if (typeof photoName === "string" && photoName.startsWith("places/")) {
        const photoUrl = getPlacePhotoUrl(photoName);
        setPhotoUrl(photoUrl);
      } else {
        setPhotoUrl("/logo.png");
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
      setPhotoUrl("/logo.png");
    }
  };

  return (
    <div className="border rounded-xl p-4 flex flex-col hover:scale-105 transition-all hover:shadow duration-200 ease-in-out cursor-pointer h-full">
      <a
        // href={
        //   plan?.Coordinates?.latitude && plan?.Coordinates?.longitude
        //     ? `https://www.google.com/maps/search/?api=1&query=${plan.Coordinates.latitude},${plan.Coordinates.longitude}`
        //     : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plan?.PlaceName || "")}`
        // }
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plan?.PlaceName || "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <div className="border rounded-xl p-4 flex flex-col hover:scale-105 transition-all hover:shadow duration-200 ease-in-out cursor-pointer h-[420px]">
          {/* Image */}
          <img
            src={photoUrl} // Chỉ dùng photoUrl, đã có fallback
            className="w-full h-[200px] object-cover rounded-xl mb-4 aspect-[4/3]"
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
