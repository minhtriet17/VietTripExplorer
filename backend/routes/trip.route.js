import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { createTrip, deleteTrip, getTrip, getTripsByUser } from "../controllers/trip.controller.js"


const router = express.Router()

router.post("/create", verifyToken, createTrip)
router.get("/view-trip", getTrip)
router.get("/get-all-trip", verifyToken, getTripsByUser)

router.delete("/deletetrip/:tripId/:userId", verifyToken, deleteTrip)


export default router