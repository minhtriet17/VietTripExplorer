import Trip from "../models/trip.model.js";
import { errorHandler } from "../utils/error.js";
import axios from "axios";
import slugify from "slugify";
import { fetchUnsplashImage } from "../utils/fetchUnsplashImage.js";

export const createTrip = async (req, res, next) => {
  try {
    // 1. Validate request body trước
    const { location, noOfDays, budget, traveler, startDate, endDate, aiItinerary } = req.body;
    if (!location || !noOfDays || !budget || !traveler) {
      return next(
        errorHandler(400, "Vui lòng cung cấp đầy đủ các trường thông tin.")
      );
    }

    // 2. Validate user
    if (!req.user || !req.user.id) {
      return next(
        errorHandler(403, "Bạn cần đăng nhập trước khi tạo chuyến đi.")
      );
    }

    // 3. Generate base slug
    const baseSlug = slugify(location.displayName || "", {
      lower: true,
      strict: true,
      locale: "vi",
    });

    if (!baseSlug) {
      return next(errorHandler(400, "Không thể tạo slug từ địa điểm."));
    }

    // 4. Check if slug is unique, and create a unique slug
    const generateUniqueSlug = async (baseSlug) => {
      let uniqueSlug = baseSlug;
      let count = 1;
      // Kiểm tra xem slug đã tồn tại chưa
      while (await Trip.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${count}`;
        count++;
      }
      return uniqueSlug;
    };

    // Tạo slug duy nhất
    const slug = await generateUniqueSlug(baseSlug);

    // 4. Lấy toạ độ từ Nominatim
    let coordinates = { lat: null, lng: null };
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: location.displayName,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "viet-trip-explaner/1.0 (nhmtriet17@gmail.com)",
          },
        }
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        coordinates.lat = parseFloat(lat);
        coordinates.lng = parseFloat(lon);
      } else {
        console.warn(
          "Không tìm thấy toạ độ cho địa điểm:",
          location.displayName
        );
      }
    } catch (geoErr) {
      console.error("Lỗi khi lấy toạ độ:", geoErr.message);
    }

    // 5. Tạo mới Trip document
    const newTrip = new Trip({
      location: {
        ...location,
        ...coordinates,
      },
      noOfDays,
      budget: String(budget), // ép kiểu về String nếu frontend gửi number
      traveler,
      startDate,
      endDate,
      aiItinerary: aiItinerary || null, // phòng khi không có aiItinerary
      userId: req.user.id,
      slug,
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    console.error("Lỗi khi tạo chuyến đi:", error);
    next(errorHandler(500, "Đã xảy ra lỗi khi tạo chuyến đi."));
  }
};

export const getTrip = async (req, res, next) => {
  try {
    const slug = req.query.slug;
    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const trip = await Trip.findOne({ slug });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Hàm tạo ảnh từ tên địa điểm
    const enrichedLocations = await Promise.all(
      (trip.locations || []).map(async (location) => {
        const { displayName } = location;

        // Nếu location đã có ảnh thì giữ nguyên, nếu không thì lấy từ Unsplash
        let locationImage = image;
        let imageInfo = null;

        if (!locationImage) {
          const imageData = await fetchUnsplashImage(displayName || "Vietnam");

          // Nếu có ảnh từ Unsplash, lưu ảnh vào location
          if (imageData) {
            locationImage = imageData.url;
            imageInfo = {
              alt: imageData.alt,
              author: imageData.author,
              authorLink: imageData.author_link,
            };
            // Cập nhật ảnh vào database nếu cần thiết (tuỳ vào yêu cầu của bạn)
            location.image = locationImage;
            // Cập nhật thông tin ảnh vào DB (nếu bạn muốn lưu ảnh vào DB)
            await location.save();
          } else {
            locationImage = `https://source.unsplash.com/800x400/?${encodeURIComponent(
              displayName || "vietnam"
            )}`;
          }
        }

        return {
          ...location._doc,
          image: locationImage,
          imageInfo: imageInfo || null,
        };
      })
    );

    res.status(200).json({
      trip: {
        ...trip._doc, // giữ nguyên các thông tin khác của trip
        locations: enrichedLocations,
      },
    });
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTripsByUser = async (req, res, next) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId in query" });
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const tripPlans = await Trip.find({ userId })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalTripPlans = await Trip.countDocuments({ userId });

    res.status(200).json({
      tripPlans,
      totalTripPlans,
    });
  } catch (error) {
    console.error("Error in getTripsByUser:", error);
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not authorized to delete this post!")
    );
  }

  try {
    await Trip.findByIdAndDelete(req.params.tripId);

    res.status(200).json("Lịch trình đã được xóa thành công!");
  } catch (error) {
    next(error);
  }
};
