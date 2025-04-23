import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import GoogleAuth from "@/components/shared/GoogleAuth";

import ReCAPTCHA from "react-google-recaptcha";

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." }),

    email: z.string().email({ message: "Invalid email address. " }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters. " }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match!",
  });

const SignUpForm = () => {
  const [captchaToken, setCaptchaToken] = useState("");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  async function onSubmit(values) {
    if (!captchaToken) {
      toast("Please complete the reCAPTCHA verification!");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const payload = {
        ...values,
        captchaToken,
      };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        toast("Sign up failed! Please try again.");
        return setErrorMessage(data.message);
      }

      setLoading(data);

      if (res.ok) {
        toast("Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.");
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
      toast("Something went wrong!");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white px-4 py-10">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10 bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        {/* Left Section */}
        <div className="flex-1 text-center md:text-left">
          <Link to="/" className="text-3xl sm:text-5xl font-bold text-blue-600">
            VietTrip<span className="text-slate-800">Explorer</span>
          </Link>
          <h2 className="text-xl sm:text-3xl font-bold mt-6">
            Tạo tài khoản mới
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Chào mừng bạn đến với nền tảng khám phá và gợi ý địa điểm du lịch
            Việt Nam!
          </p>
          <img
            src="/logo.png"
            alt="Travel Banner"
            className="w-full mt-6 rounded-xl shadow-md hidden md:block"
          />
        </div>

        {/* Right Section - Form */}
        <div className="flex-1 w-full max-w-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên người dùng</FormLabel>
                    <FormControl>
                      <Input placeholder="travel_lover" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl transition duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-pulse">Đang đăng ký...</span>
                ) : (
                  <span>Đăng ký</span>
                )}
              </Button>

              <GoogleAuth />
            </form>
          </Form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Đã có tài khoản?{" "}
            <Link
              to="/sign-in"
              className="text-blue-500 font-medium hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </div>

          {errorMessage && (
            <p className="mt-4 text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
