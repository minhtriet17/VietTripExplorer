import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    "X-Goog-FieldMask": [
      "places.photos",
      "places.displayName",
      "places.id",
      "places.location",
    ].join(","),
  },
};

export const GetPlacesDetails = (data) => axios.post(BASE_URL, data, config);

export const getPlacePhotoUrl  = (photoName) => {
  return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=600&maxWidthPx=600&key=${
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  }`;
};
