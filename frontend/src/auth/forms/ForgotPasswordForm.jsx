import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import axios from "axios";

const ForgotPasswordForm = () => {
  const form = useForm();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email: data.email
      });
      setSuccessMessage(response.data.message);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Có lỗi xảy ra.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg-vietnam.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 p-4 sm:p-8 w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Quên Mật Khẩu 🔒</h2>
        <p className="text-slate-600 text-center mb-6">
          Nhập email bạn đã đăng ký, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="xyz@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
              Gửi yêu cầu đặt lại mật khẩu
            </Button>
          </form>
        </Form>

        {successMessage && <p className="mt-4 text-green-600 text-center">{successMessage}</p>}
        {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}

        <div className="text-sm text-slate-600 mt-6 text-center">
          Quay lại{" "}
          <Link to="/sign-in" className="text-blue-600 hover:underline">
            trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;