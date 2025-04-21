import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
  signOutSuccess,
} from "@/redux/user/userSlice";
import { getFilePreview, uploadFile } from "@/lib/appwrite/uploadImage";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
} from "../ui/alert-dialog";

const DashboardProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const profilePicRef = useRef();
  const dispatch = useDispatch();

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "",
    confirmPassword: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // console.log(file)
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const uploadImage = async () => {
    if (!imageFile) return currentUser.profilePicture;

    try {
      const uploadedFile = await uploadFile(imageFile);
      const profilePictureUrl = getFilePreview(uploadedFile.$id);

      return profilePictureUrl;
    } catch (error) {
      toast("Update user failed. Please try again!");
      console.log("Image upload failed: ", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      dispatch(updateStart());
      // wait for image upload
      const profilePicture = await uploadImage();
      console.log("Uploaded Image URL:", profilePicture);

      const updateProfile = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profilePicture,
      };

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(updateProfile),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorData = await res.json();
        dispatch(updateFailure(errorData.message || "Update failed"));
        toast.error(
          errorData.message || "Update user failed. Please try again!"
        );
        return; // dừng luôn
      }
      dispatch(updateSuccess(data));
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Catch error:", error);
      dispatch(updateFailure(error.message));
      toast.error("Something went wrong. Please try again!");
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      console.log(error);
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto px-4 sm:px-6 md:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
        Cập nhật thông tin cá nhân
      </h1>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={profilePicRef}
          onChange={handleImageChange}
        />

        <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full border-4 border-gray-300 overflow-hidden shadow-md cursor-pointer transition hover:scale-105 duration-300">
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
            onClick={() => profilePicRef.current.click()}
          />
        </div>

        <Input
          type="text"
          id="username"
          placeholder="Tên người dùng"
          defaultValue={currentUser.username}
          className="h-12 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-400"
          onChange={handleChange}
        />

        <Input
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          className="h-12 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-400"
          onChange={handleChange}
        />

        <Input
          type="password"
          id="password"
          placeholder="Mật khẩu mới"
          className="h-12 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-400"
          onChange={handleChange}
        />

        <Input
          type="password"
          id="confirmPassword"
          placeholder="Xác nhận mật khẩu mới"
          className="h-12 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-400"
          onChange={handleChange}
        />

        <Button
          type="submit"
          className={`h-12 rounded-xl font-semibold bg-green-600 text-white transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Lưu thay đổi"}
        </Button>
      </form>

      <div className="flex justify-between mt-6 items-center text-sm sm:text-base">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="text-red-600 hover:text-red-700">
              Xóa tài khoản
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn xóa không?</AlertDialogTitle>
              <AlertDialogDescription>
                Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn
                tài khoản của bạn và tất cả dữ liệu liên quan đến tài khoản của bạn.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteUser}
              >
                Tiếp tục
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="ghost"
          className="text-gray-600 hover:text-black"
          onClick={handleSignout}
        >
          Đăng xuất
        </Button>
      </div>

      {error && (
        <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
      )}
    </div>
  );
};

export default DashboardProfile;
