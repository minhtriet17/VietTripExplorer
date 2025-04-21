import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"

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

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    })

    try {
        await newUser.save()

        res.json("Signup successful")
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