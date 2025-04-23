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
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "@/redux/user/userSlice";
import GoogleAuth from "@/components/shared/GoogleAuth";

import ReCAPTCHA from "react-google-recaptcha";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address. " }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters. " }),
});

const SignInForm = () => {
  const [captchaToken, setCaptchaToken] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  async function onSubmit(values) {
    if (!captchaToken) {
      toast("Vui lòng hoàn tất xác minh reCAPTCHA!");
      return;
    }

    try {
      dispatch(signInStart());

      const payload = {
        ...values,
        captchaToken,
      };

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success === false) {
        toast("Đăng nhập thất bại! Xin hãy thử lại!");

        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        toast("Đăng nhập thành công!");
        navigate("/");
      }
    } catch (error) {
      toast("Xảy ra lỗi!");
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg-vietnam.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 p-4 sm:p-8 w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
        {/* Left - Branding */}
        <div className="flex flex-col justify-center">
          <Link
            to="/"
            className="text-4xl font-extrabold text-emerald-600 mb-4"
          >
            VietTrip<span className="text-blue-500">Explorer</span>
          </Link>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-snug">
            Hãy đăng nhập để khám phá Việt Nam 🌄🏖️
          </h2>

          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Chào mừng bạn quay lại! Truy cập vào tài khoản để lưu hành trình,
            chia sẻ trải nghiệm và nhận gợi ý địa điểm du lịch phù hợp nhất với
            bạn.
          </p>
        </div>

        {/* Right - Form */}
        <div className="bg-white p-6 sm:p-10 rounded-xl shadow-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="xyz@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật Khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
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
                className="bg-blue-600 hover:bg-blue-700 w-full text-white font-semibold py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-pulse">Đang đăng nhập...</span>
                ) : (
                  "Đăng nhập"
                )}
              </Button>

              <GoogleAuth />
            </form>
          </Form>

          <div className="flex justify-between items-center mt-6 text-sm text-slate-600">
            <span>Bạn chưa có tài khoản?</span>
            <Link to="/sign-up" className="text-blue-600 hover:underline">
              Đăng ký
            </Link>
          </div>

          {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
