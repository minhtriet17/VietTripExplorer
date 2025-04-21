import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import UserTripCardItem from "@/components/shared/UserTripCardItem";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


const MyTrip = () => {
    const [loading, setLoading] = useState(true);
    const {currentUser} = useSelector((state) => state.user)

    const [tripIdToDelete, setTripIdToDelete] = useState("")

    const [userPlans, setUserPlans] = useState([])
    const [showMore, setShowMore] = useState(true)

    useEffect(() => {
        const fetchTrips = async () => {
          try {
            const res = await fetch(`/api/trip/get-all-trip?userId=${currentUser._id}`);
            const data = await res.json();
      
            if (res.ok) {
                setUserPlans(data.tripPlans); // nhớ đặt state đúng tên
      
              if (data.tripPlans.length < 1) {
                setShowMore(false);
              }
            }
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false); 
          }
        };
      
        if (currentUser?._id) {
          fetchTrips();
        }
      }, [currentUser._id]);

      console.log("Trip Plans:", userPlans);

    if (loading) return <div>Loading...</div>;
    
    const handleDeleteTrip = async () => {
        try {
          const res = await fetch(
            `/api/trip/deletetrip/${tripIdToDelete}/${currentUser._id}`,
            {
              method: "DELETE",
            }
          )
    
          const data = await res.json()
    
          if (!res.ok) {
            console.log(data.message)
          } else {
            setUserPlans(
              (prev) => prev.filter((trip) => trip._id !== tripIdToDelete)
            )
          }
        } catch (error) {
          console.log(error.message)
        }
      }
    return (
        <div className="px-4 py-10 sm:px-6 md:px-12 lg:px-20 xl:px-32 bg-gray-50 min-h-screen">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
            Lịch Trình Của Tôi
          </h2>
      
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {userPlans.length > 0 ? (
              userPlans.map((plan) => (
                <div key={plan._id} className="relative bg-white rounded-xl shadow-md overflow-hidden">
                  <UserTripCardItem plan={plan} />
      
                  <div className="absolute top-2 right-2 z-10">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() => setTripIdToDelete(plan._id)}
                          className="text-sm text-red-600 hover:underline cursor-pointer"
                        >
                          Xóa
                        </button>
                      </AlertDialogTrigger>
      
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Bạn có chắc chắn xóa không?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Thao tác này sẽ xóa vĩnh viễn lịch trình khỏi hệ thống. Bạn không thể hoàn tác sau khi xác nhận.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
      
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600" onClick={handleDeleteTrip}>
                            Xác nhận
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">Không có lịch trình nào.</p>
            )}
          </div>
        </div>
    );
};

export default MyTrip;
