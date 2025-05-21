import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { addScheduleToTrip, createTrip, deleteScheduleFromTrip, deleteTrip, getTrip, getTripsByUser, updateScheduleInTrip, updateTrip } from "../controllers/trip.controller.js"


const router = express.Router()

router.post("/create", verifyToken, createTrip)
router.get("/view-trip", getTrip)
router.get("/get-all-trip", verifyToken, getTripsByUser)

router.delete("/deletetrip/:tripId/:userId", verifyToken, deleteTrip)

router.put("/updatetrip/:tripId/:userId", verifyToken, updateTrip)

// Schedule APIs
router.post("/:tripId/day/:day/schedule", verifyToken, addScheduleToTrip);
router.put("/:tripId/day/:day/schedule/:scheduleId", verifyToken, updateScheduleInTrip);
router.delete("/:tripId/day/:day/schedule/:scheduleId", verifyToken, deleteScheduleFromTrip);


export default router