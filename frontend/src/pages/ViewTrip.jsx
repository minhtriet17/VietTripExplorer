import Advertise from '@/components/shared/Advertise'
import Hotels from '@/components/shared/Hotels'
import InfoSection from '@/components/shared/InfoSection'
import PlacesToVisit from '@/components/shared/PlacesToVisit'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const ViewTrip = () => {
    const {tripSlug} = useParams()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [trip, setTrip] = useState(null)

    // console.log(recentArticles)

    console.log(trip)
    useEffect(() => {
        const fetchTrip = async() => {
            try {
                setLoading(true)

                const res = await fetch(`/api/trip/view-trip?slug=${tripSlug}`)

                const data = await res.json()

                if (!res.ok) {
                    setError(true)
                    setLoading(false)

                    return
                }

                if(res.ok) {
                    setTrip(data.trip)
                    setLoading(false)
                    setError(false)
                }
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }

        fetchTrip()
    }, [tripSlug])

    if(loading) {
        return <div className='flex justify-center items-center min-h-screen'>
            <img src="https://cdn-icons-png.flaticon.com/128/39/39979.png" alt="loading" 
                className='w-20 animate-spin'/>
        </div>
    }

    if (error) {
        return <div className="text-center text-red-500">Lỗi khi tải lịch trình du lịch.</div>
    }

    if (!trip) {
        return <div className="text-center">Không tìm thấy lịch trình du lịch.</div>
    }
    
  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56 flex flex-col gap-10">
        {/* Information Section */}
        <InfoSection trip={trip} />
        {/* Recommended Hotels */}
        <Hotels trip={trip} />
        {/* Daily Plan */}
        <PlacesToVisit trip={trip} />
    </div>
  )
}

export default ViewTrip 