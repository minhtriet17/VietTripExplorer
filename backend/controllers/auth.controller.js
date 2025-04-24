import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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
            subject: 'Hãy xác minh địa chỉ email của bạn',
            html: `
                <p>Xin chào ${username},</p>
                <p>Cảm ơn bạn đã đăng ký. Vui lòng xác minh email của bạn bằng cách nhấp vào liên kết bên dưới:</p>
                <a href="${verificationUrl}">${verificationUrl}</a>
                <p>Liên kết này sẽ hết hạn sau 24 giờ.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            success: true,
            message: "Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản của bạn."
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

export const verifyEmail = async (req, res, next) => {
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
        next(error)
        return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }
};

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    if (!email || email === "") {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Tạo token reset mật khẩu
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 phút

        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        console.log("Reset URL: ", resetUrl);

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
            subject: 'Yêu cầu đặt lại mật khẩu!',
            html: `
                <p>Xin chào ${user.username},</p>
                <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>Liên kết này sẽ hết hạn sau 15 phút.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "Đã gửi email đặt lại mật khẩu" });

    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    console.log("Token in backend:", token);
    const { password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ success: false, message: "Missing token or password" });
    }

    // Mã hóa token trước khi so sánh
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken: hashToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({ success: true, message: "Đặt lại mật khẩu thành công" });

    } catch (err) {
        console.error(err);
        next(err);
    }
};