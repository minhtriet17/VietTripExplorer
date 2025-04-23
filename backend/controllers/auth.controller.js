import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer';

import fetch from 'node-fetch'

export const signup = async (req, res, next) => {
    const {username, email, password, captchaToken } = req.body

    if (!captchaToken) {
        return res.status(400).json({ success: false, message: "Missing captcha token" });
    }

    const secretKey = process.env.RECAPTCHA_SECRET; // <-- Thay bằng Secret key

    // Verify captcha with Google
    const captchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`
    const captchaResponse = await fetch(captchaVerifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${captchaToken}`
    })
    const captchaData = await captchaResponse.json()

    if (!captchaData.success) {
      return res.status(400).json({ success: false, message: "Captcha verification failed" })
    }

    if (!username || !email || !password || username === "" || email==="" || password==="") {
        return next(errorHandler(400, "All fields are required"))
    }

    
    try {
        const hashedPassword = bcryptjs.hashSync(password, 10)

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already in use" });
        }

        const newUser = new User({
        username,
        email,
        password: hashedPassword,
        isVerified: false
    })
        await newUser.save()

        // Tạo token xác minh email
        const emailToken = jwt.sign(
            { email },
            process.env.EMAIL_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`;

        // Gửi email xác minh
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            }
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Verify your email address',
            html: `
                <p>Hello ${username},</p>
                <p>Thank you for registering. Please verify your email by clicking the link below:</p>
                <a href="${verificationUrl}">${verificationUrl}</a>
                <p>This link will expire in 24 hours.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            success: true,
            message: "Signup successful. Please check your email to verify your account."
        });
    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    const {email, password, captchaToken} = req.body

    if (!captchaToken) {
        return res.status(400).json({ success: false, message: "Missing captcha token" });
    }

    const secretKey = process.env.RECAPTCHA_SECRET; // <-- Thay bằng Secret key

    // Verify captcha with Google
    const captchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`
    const captchaResponse = await fetch(captchaVerifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${captchaToken}`
    })
    const captchaData = await captchaResponse.json()

    if (!captchaData.success) {
      return res.status(400).json({ success: false, message: "Captcha verification failed" })
    }

    if (
        !email || 
        !password || 
        email==="" || 
        password==="") {
        return next(errorHandler(400, "All fields are required"))
    }

    try {
        const validUser = await User.findOne({ email})

        if (!validUser) {
            return next(errorHandler(400, "User not found"))
        }

        const validPasswword = bcryptjs.compareSync(password, validUser.password)

        if (!validPasswword) {
            return next(errorHandler(400, "Wrong Credentials"))
        }

        const token = jwt.sign({ 
            id: validUser._id, 
            isAdmin: validUser.isAdmin 
        }, process.env.JWT_SECRET)

        const {password: pass, ...rest} = validUser._doc

        res.status(200).cookie("access_token", token, {httpOnly: true}).json(rest)

    } catch (error) {
        next(error)
    }
}

export const google = async(req, res, next) => {
    const {email, name, profilePhotoUrl} = req.body

    try {
        const user = await User.findOne({email})

        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET)

            const {password: pass, ...rest} = user._doc

            return res.status(200).cookie("access_token", token, {
                httpOnly: true,
            }).json(rest)
        }

        const generatedPassword = 
            Math.random().toString(36).slice(-8) + 
            Math.random().toString(36).slice(-8)

        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)

        const newUser = new User ({
            username: 
                name.toLowerCase().split(" ").join("") +
                Math.random().toString(9).slice(-4),
            email,
            password: hashedPassword,
            profilePicture: profilePhotoUrl,
        })

        await newUser.save()

        const token = jwt.sign({ 
            id: newUser._id, 
            isAdmin: newUser.isAdmin 
        }, process.env.JWT_SECRET)

        const {password: pass, ...rest} = newUser._doc

        return res.status(200).cookie("access_token", token, {
            httpOnly: true,
        }).json(rest)

    } catch (error) {
        next(error)
    }
}

export const verifyEmail = async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).json({ success: false, message: "Missing token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);

        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(200).json({ success: true, message: "Email already verified" });
        }

        user.isVerified = true;
        await user.save();

        return res.status(200).json({ success: true, message: "Email successfully verified" });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }
};