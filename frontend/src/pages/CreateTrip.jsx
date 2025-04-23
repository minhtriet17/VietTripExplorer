import PlacesAutocomplete from '@/components/shared/PlacesAutocomplete'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
import { chatSession } from '@/service/AIModal';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from "react-redux";

const CreateTrip = () => {

    const [place, setPlace] = useState();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.user);

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        })
      };

      useEffect(() => {
        console.log(formData)
      }, [formData])

      const handlePlaceSelected = (address) => {
        console.log(address); // In ra địa chỉ khi người dùng chọn
        setPlace(address);    // Cập nhật địa chỉ khi chọn
        handleInputChange('location', address); // Cập nhật giá trị vào formData
      };

    const OnGenerateTrip= async () => {

        if (!currentUser || !currentUser._id) {
            toast.error("Bạn cần đăng nhập để tạo lịch trình!");
            navigate("/sign-in");
            return;
        }

        if (
            !formData?.location ||
            !formData?.noOfDays ||
            !formData?.budget ||
            !formData?.traveler
          )
        { 
            toast("Hãy nhập đầy đủ thông tin để tạo lịch trình!")
            return
        }

        setLoading(true); // Bắt đầu loading khi nhấn nút

        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.location?.displayName)
            .replace('{totalDays}', formData?.noOfDays)
            .replace('{traveler}', formData?.traveler)
            .replace('{budget}', formData?.budget)
            .replace('{totalDays}', formData?.noOfDays)

            console.log(FINAL_PROMPT)


            try {
                const result = await chatSession.sendMessage(FINAL_PROMPT)

                const response = await result?.response?.text();

                console.log("--", response)

                let parsedAiItinerary;

                try {
                    parsedAiItinerary = JSON.parse(response);
                  } catch (error) {
                    console.error("Không thể parse JSON từ AI:", error);
                    toast.error("Dữ liệu AI trả về không hợp lệ.");
                    return;
                  }

                const tripDataToSave = {
                    ...formData,
                    aiItinerary: parsedAiItinerary, 
                };

                console.log(typeof response);           // string
                console.log(typeof parsedAiItinerary);  // object

                const res = await fetch('/api/trip/create', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  credentials: 'include', // BẮT BUỘC để gửi cookie
                  body: JSON.stringify(tripDataToSave)
                });

                if (res.status === 401) {
                    toast.error("Bạn cần đăng nhập để tạo lịch trình!");
                    navigate("/sign-in");
                    return;
                }

                const data = await res.json();
              
                if (res.ok) {
                  toast.success("Lịch trình đã được lưu thành công!");

                  navigate(`/view-trip/${data.slug}`)
                } else {
                  toast.error("Có lỗi xảy ra khi lưu lịch trình!");
                }
            } catch (err) {
                console.error(err);
                toast.error("Lỗi kết nối đến máy chủ!");
            } finally {
                setLoading(false);  // Kết thúc loading dù kết quả có thành công hay không
            }
    }


    
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
        <h2 className='font-bold text-3xl text-center mb-10'>
            Hãy cho chúng tôi biết sở thích du lịch của bạn 🏕️🌴
        </h2>

        <p className="mt-3 text-lg text-center text-slate-500">
            Chỉ cần cung cấp cho chúng tôi một số thông tin cơ bản về chuyến đi của bạn và chúng tôi sẽ tạo ra một hành trình phù hợp dành riêng cho bạn.
        </p>

        <div className="mt-20">
            <div className="">
                <h2 className="text-xl font-medium my-3">
                    Điểm đến của chuyến đi của bạn ở đâu?
                </h2>

                <PlacesAutocomplete
                    value={place}
                    onChange={(v) => { 
                        setPlace(v); 
                        handleInputChange('location', v);
                    }}
                    onPlaceSelected={handlePlaceSelected}  // Hàm xử lý khi chọn địa điểm
                 />
            </div>

            <div className="mt-10">
                <h2 className="text-xl my3 font-medium">
                    Bạn sẽ ở lại bao lâu?
                </h2>
                <Input placeholder={'Ex.3'} type="number"
                    onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                />
            </div>
        </div>

        <div className='mt-10'>
            <h2 className='text-xl my-3 font-medium'>
                Chi tiêu của bạn cho chuyến đi này là bao nhiêu
            </h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {SelectBudgetOptions.map((item, index) => (
                    <div key={index}
                        onClick={() => handleInputChange('budget', item.title)}
                        className={`p-4 border rounded-lg hover:shadow-lg
                        cursor-pointer flex flex-col items-center justify-center
                        ${formData.budget === item.title ? 'bg-blue-100 border-black shadow-lg' : ''}`}>
                        <h2 className='text-4xl'>{item.icon}</h2>
                        <h2 className='font-bold text-lg'>{item.title}</h2>
                        <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                    </div>
                ))}
            </div>
        </div>

        <div className='mt-10'>
            <h2 className='text-xl my-3 font-medium'>
                Bạn đi du lịch cùng với ai?
            </h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {SelectTravelesList.map((item, index) => (
                    <div key={index} 
                        onClick={() => handleInputChange('traveler', item.people)}
                        className={`p-4 border rounded-lg hover:shadow-lg
                            cursor-pointer flex flex-col items-center justify-center
                            ${formData.traveler === item.people ? 'bg-blue-100 border-black shadow-lg' : ''}`}>
                        <h2 className='text-4xl'>{item.icon}</h2>
                        <h2 className='font-bold text-lg'>{item.title}</h2>
                        <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                    </div>
                ))}
            </div>
        </div>

        <div className='my-10 flex items-center justify-end'>
                <Button onClick={OnGenerateTrip} type="submit" className="cursor-pointer" disabled={loading}>
                    {loading ? (
                        <div className="w-5 h-5 border-4 border-t-transparent border-blue-400 border-solid rounded-full animate-spin"></div>
                    ) : (
                        'Tạo lịch trình'
                    )}
                </Button>
            </div>
        
    </div>
  )
}

export default CreateTrip