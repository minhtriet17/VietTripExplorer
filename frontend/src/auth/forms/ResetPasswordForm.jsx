import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router-dom";

const ResetPasswordForm = () => {
  //   const [searchParams] = useSearchParams();
  //   const token = searchParams.get("token");
  const { token } = useParams();
  console.log("Token: ", token);

  const navigate = useNavigate();

  const form = useForm();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    if (!token) {
      setErrorMessage("Token không hợp lệ hoặc đã hết hạn.");
      return; // Không tiếp tục nếu token không hợp lệ
    }

    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, {
        password: data.password,
      });
      setSuccessMessage(res.data.message);
      setErrorMessage("");

      setTimeout(() => navigate("/sign-in"), 3000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Đặt lại mật khẩu thất bại."
      );
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    if (!token) {
      setErrorMessage("Token không hợp lệ hoặc đã hết hạn.");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg-vietnam.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 p-4 sm:p-8 w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
          Đặt Lại Mật Khẩu 🔐
        </h2>
        <p className="text-slate-600 text-center mb-6">
          Nhập mật khẩu mới của bạn bên dưới.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mật khẩu mới" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              Xác nhận
            </Button>
          </form>
        </Form>

        {successMessage && (
          <p className="mt-4 text-green-600 text-center">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
