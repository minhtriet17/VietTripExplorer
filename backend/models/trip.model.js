import mongoose from "mongoose"

const tripSchema = new mongoose.Schema(
{
    location: {
        displayName: String,
        lat: Number,
        lng: Number
    },
    noOfDays: Number,
    budget: String,
    traveler: String,
    aiItinerary: {
        tripDetails: {
          destination: String,
          duration: String,
          targetAudience: String,
          budget: String,
          bestTimeToVisit: String
        },
        hotelOptions: [
          {
            HotelName: String,
            Address: String,
            Price: String,
            ImageUrl: String,
            Coordinates: {
              latitude: Number,
              longitude: Number
            },
            Rating: Number,
            Description: String
          }
        ],
        dailyItinerary: [
          {
            day: Number,
            theme: String,
            schedule: [
              {
                Time: String,
                PlaceName: String,
                Details: String,
                ImageUrl: String,
                Coordinates: {
                  latitude: Number,
                  longitude: Number
                },
                TicketPrice: String,
                EstimatedDuration: String
              }
            ]
          }
        ]
      },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
      }
});

const Trip = mongoose.model("Trip", tripSchema)

export default Trip
