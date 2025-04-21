import React from 'react'
import HotelCardItem from './HotelCardItem'

const Hotels = ({trip}) => {

  if (!trip || !trip.aiItinerary || !trip.aiItinerary.hotelOptions) {
    return <div className='px-4 md:px-8 mt-5'>Không có dữ liệu khách sạn.</div>;
  }

  return (
    <div className='flex flex-col gap-5 px-4 md:px-8'>
        <h2 className="font-bold text-xl mt-5">
            Khách sạn được đề xuất
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {trip.aiItinerary?.hotelOptions?.map((hotel, index) => (
                <HotelCardItem key={index} hotel={hotel}/>
            ))}
        </div>
    </div>
  )
}

export default Hotels