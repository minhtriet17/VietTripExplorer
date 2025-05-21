import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserTripCardItem from "@/components/shared/UserTripCardItem";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

const MyTrip = () => {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  const [tripIdToDelete, setTripIdToDelete] = useState("");
  const [userPlans, setUserPlans] = useState([]);

  // Pagination states:
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser._id) {
      navigate("/sign-in");
      return;
    }
    const fetchTrips = async () => {
      try {
        const res = await fetch(
          `/api/trip/get-all-trip?userId=${currentUser._id}`
        );
        const data = await res.json();

        if (res.ok) {
          setUserPlans(data.tripPlans);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [currentUser, navigate]);

  if (loading) return <Spinner />;

  // Tính chỉ số để lấy phần tử cho trang hiện tại
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = userPlans.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(userPlans.length / itemsPerPage);

  const handleDeleteTrip = async () => {
    try {
      const res = await fetch(
        `/api/trip/deletetrip/${tripIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPlans((prev) =>
          prev.filter((trip) => trip._id !== tripIdToDelete)
        );
        if ((currentItems.length === 1) && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Hàm render nút số trang
  const renderPageNumbers = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded-md border ${
            currentPage === i
              ? "bg-blue-600 text-white cursor-default"
              : "bg-white text-blue-600 hover:bg-blue-100"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="px-4 py-10 sm:px-6 md:px-12 lg:px-20 xl:px-32 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
        Lịch Trình Của Tôi
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentItems.length > 0 ? (
          currentItems.map((plan) => (
            <div
              key={plan._id}
              className="relative bg-white rounded-xl shadow-md overflow-hidden"
            >
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
                      <AlertDialogTitle>
                        Bạn có chắc chắn xóa không?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Thao tác này sẽ xóa vĩnh viễn lịch trình khỏi hệ thống.
                        Bạn không thể hoàn tác sau khi xác nhận.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600"
                        onClick={handleDeleteTrip}
                      >
                        Xác nhận
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            Không có lịch trình nào.
          </p>
        )}
      </div>

      {/* Pagination controls */}
      {userPlans.length > itemsPerPage && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 rounded-md border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-blue-600 hover:bg-blue-100"
            }`}
          >
            Trang trước
          </button>

          {renderPageNumbers()}

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className={`px-4 py-2 rounded-md border ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-blue-600 hover:bg-blue-100"
            }`}
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default MyTrip;
