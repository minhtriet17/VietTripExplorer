import React from "react";
import PlaceCardItem from "./PlaceCardItem";

const PlacesToVisit = ({ trip }) => {
  if (!trip || !trip.aiItinerary || !trip.aiItinerary.dailyItinerary) {
    return (
      <div className="px-4 md:px-8 mt-5">Không có địa điểm tham quan.</div>
    );
  }

  // Hàm format ngày
  const formatDay = (day) => {
    if (typeof day === "string" && day.includes("-")) {
      const d = new Date(day);
      if (!isNaN(d)) {
        const dayVn = String(d.getDate()).padStart(2, "0");
        const monthVn = String(d.getMonth() + 1).padStart(2, "0");
        const yearVn = d.getFullYear();
        return `${dayVn}/${monthVn}/${yearVn}`;
      }
    }
    // Trường hợp khác trả về nguyên giá trị
    return day;
  };

  return (
    <div className="font-bold text-lg">
      Địa điểm tham quan
      <div className="">
        {trip.aiItinerary?.dailyItinerary?.map((item, index) => (
          <div className="mt-5" key={index}>
            <h2 className="font-bold text-lg mt-5">
              Ngày {formatDay(item?.day)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-2 gap-5 col-span-2 md:col-span-2 lg:col-span-2">
              {item?.schedule?.map((plan, index) => (
                <div className="my-3 flex flex-col gap-2" key={index}>
                  <h2 className="font-medium text-sm text-orange-600 mt-2">
                    {plan?.Time}
                  </h2>
                  <PlaceCardItem plan={plan} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesToVisit;
