import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

const EmailVerifyPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      toast("Không tìm thấy token xác minh.");
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage("Xác minh email thành công! Hãy đăng nhập.");
        } else {
          setStatus("error");
          setMessage("Xác minh thất bại: " + data.message);
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Lỗi xác minh email.");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-lg text-center">
        {status === "loading" && (
          <p className="text-lg font-medium text-gray-600">
            Đang xác minh email...
          </p>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
            <h2 className="text-xl font-bold text-green-600">{message}</h2>
            <button
              onClick={() => navigate("/sign-in")}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              Đăng nhập
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto text-red-500 w-16 h-16 mb-4" />
            <h2 className="text-xl font-bold text-red-600">{message}</h2>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600"
            >
              Quay về trang chủ
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default EmailVerifyPage;
