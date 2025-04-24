import express from "express"
import { signup, signin, google, verifyEmail, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/google", google)
router.get('/verify-email', verifyEmail);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router