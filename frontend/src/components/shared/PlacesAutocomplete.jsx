import { useState, useEffect } from "react";
import axios from "axios";
import mapboxSdk from "@mapbox/mapbox-sdk/services/geocoding";
import "leaflet/dist/leaflet.css";

const mapboxToken = import.meta.env.VITE_MAP_BOX_API_KEY; // Lấy token từ biến môi trường
const geocodingClient = mapboxSdk({ accessToken: mapboxToken });

export default function PlacesAutocomplete({ onPlaceSelected }) {
  const [address, setAddress] = useState("");

  const [places, setPlaces] = useState([]);
  const [isPlaceSelected, setIsPlaceSelected] = useState(false); // Thêm trạng thái để theo dõi việc chọn khu vực

  const [loading, setLoading] = useState(false); // Thêm state loading
  const [error, setError] = useState(null); // Thêm state để quản lý lỗi

  // Hàm gọi API để lấy danh sách khu vực
  const fetchPlaces = async (query) => {
    if (query.trim() === "") {
      setPlaces([]);
      return;
    }

    setLoading(true); // Bắt đầu trạng thái loading
    setError(null); // Reset lỗi khi bắt đầu gọi API

    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: query,
          limit: 5,
          countries: ["vn"], // Giới hạn tìm kiếm ở Việt Nam
          language: ["vi"]
        })
        .send();

        const features = response.body.features || [];

        const mappedPlaces = features.map((place) => ({
          lat: place.center[1],
          lon: place.center[0],
          displayName: place.place_name,
        }));

      
        setPlaces(mappedPlaces);
    } catch (error) {
      console.error("Mapbox API error:", error);
      setError("Lỗi khi tìm kiếm địa điểm.");
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  // Gọi API mỗi khi người dùng thay đổi input
  useEffect(() => {
    if (!isPlaceSelected) {
      const delayDebounceFn = setTimeout(() => {
        fetchPlaces(address);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [address, isPlaceSelected]);

  // Xử lý khi người dùng chọn một khu vực từ danh sách
  const handlePlaceSelect = (place) => {
    setAddress(place.displayName);
    setPlaces([]);
    setIsPlaceSelected(true);
    
    if (typeof onPlaceSelected === "function") {
      onPlaceSelected(place);
    }
  };

  // Cho phép người dùng nhập lại để tìm kiếm khu vực mới
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setIsPlaceSelected(false); // Cho phép tìm kiếm lại
  };

  return (
    <div>
      <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        placeholder="Nhập địa điểm..."
        className="border p-2 rounded-md w-full"
      />

      {/* Loading State */}
      {loading && <div className="mt-2">Đang tải...</div>}

      {/* Error State */}
      {error && <div className="mt-2 text-red-500">{error}</div>}

      {/* Danh sách khu vực */}
      {places.length > 0 && !loading && (
        <ul className="bg-white z-50 border mt-2 rounded-md max-h-48 overflow-y-auto">
          {places.map((place, index) => (
            <li
              key={index}
              onClick={() => handlePlaceSelect(place)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {place.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}