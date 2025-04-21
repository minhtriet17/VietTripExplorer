import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';;
import { toast } from "sonner";
import { getFilePreview, uploadFile } from "@/lib/appwrite/uploadImage";
import { Link, useNavigate } from "react-router-dom";

//Quill.register('modules/imageResize', ImageResize);

const CreatePost = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploading, setImageUploading] = useState(null);

  const quillRef = useRef(null);

  const [formData, setFormData] = useState({});
  // console.log(formData)

  const [createPostError, setCreatePostError] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image!");
        toast("Please select an image!");
        return;
      }

      setImageUploading(true);

      setImageUploadError(null);

      const uploadedFile = await uploadFile(file);
      const postImageUrl = getFilePreview(uploadedFile.$id);

      setFormData({ ...formData, image: postImageUrl });

      toast("Image uploaded Successfully!");
      setImageUploading(false);
      setPreviewImage(null); // Reset preview sau khi upload xong
    } catch (error) {
      setImageUploadError("Image upload failed");
      console.log(error);

      toast("Image upload failed!");
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast("Something went wrong! Please try again.");
        setCreatePostError(data.message);

        return;
      }

      if (res.ok) {
        toast("Article Published Successfully!");
        setCreatePostError(null);

        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      toast("Something went wrong! Please try again.");
      setCreatePostError("Something went wrong! Please try again.");
    }
  };

  const handleImageUploadInEditor = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const uploadedFile = await uploadFile(file);
          const url = getFilePreview(uploadedFile.$id);

          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, "image", url);

          // Đảm bảo rằng module resize có thể chỉnh sửa ảnh đã được chèn vào
          // const img = editor.root.querySelector("img[src='" + url + "']");
          // if (img) {
          //   img.style.maxWidth = "100%"; // Đảm bảo ảnh có thể được điều chỉnh kích thước
          // }

          toast("Ảnh đã được chèn vào bài viết!");
        } catch (error) {
          console.error("Error uploading image: ", error);
          toast("Failed to upload image into editor");
        }
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: handleImageUploadInEditor,
      },
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "link",
    "image",
  ];

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto min-h-screen bg-white rounded-xl shadow-lg">
      <h1 className="text-center text-3xl sm:text-4xl font-bold mb-10 text-slate-800">
        Tạo Bài Viết Mới
      </h1>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Title + Category */}
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
          <Input
            type="text"
            placeholder="Nhập tiêu đề bài viết"
            required
            id="title"
            className="flex-1 h-14 sm:h-16 border border-slate-300 rounded-lg px-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger className="w-full sm:w-64 h-14 sm:h-16 border border-slate-300 rounded-lg px-6 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="Chọn Loại Cho Bài Viết" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Các loại bài viết</SelectLabel>
                <SelectItem value="travelnews">Tin Tức</SelectItem>
                <SelectItem value="travelguide">Hướng dẫn</SelectItem>
                <SelectItem value="touristarea">Địa điểm du lịch</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Upload Image */}
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-between border-2 border-dashed border-slate-400 p-6 rounded-lg bg-slate-50">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              setFile(selectedFile);
              if (selectedFile) {
                setPreviewImage(URL.createObjectURL(selectedFile));
              }
            }}
            className="w-full sm:w-auto"
          />

          <Button
            type="button"
            className="bg-slate-700 hover:bg-slate-800 transition px-6 py-3 text-white font-medium rounded-md"
            onClick={handleUploadImage}
            disabled={imageUploading}
          >
            {imageUploading ? "Uploading..." : "Tải hình ảnh lên"}
          </Button>
        </div>

        {imageUploadError && (
          <p className="text-red-600 text-sm mt-2">{imageUploadError}</p>
        )}

        {previewImage && (
          <div className="relative mt-6 group max-w-xl mx-auto">
            <img
              src={previewImage}
              alt="Selected preview"
              className="w-full h-72 object-cover rounded-lg shadow-lg border border-slate-300 transition-transform duration-200 group-hover:scale-105 cursor-pointer"
              onClick={() => window.open(previewImage, "_blank")}
            />
            <button
              type="button"
              onClick={() => {
                setPreviewImage(null);
                setFile(null);
              }}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-2 text-xs rounded hover:bg-red-700 transition"
            >
              Xóa
            </button>
            <p className="text-center text-sm text-slate-500 mt-2">
              Xem trước hình ảnh (nhấp để phóng to)
            </p>
          </div>
        )}

        {formData.image && !previewImage && (
          <div className="mt-6">
            <img
              src={formData.image}
              alt="Uploaded"
              className="w-full max-h-72 object-cover rounded-lg shadow-md"
            />
            <p className="text-center text-sm text-slate-500 mt-2">
              Hình ảnh sau khi tải lên
            </p>
          </div>
        )}

        {/* ReactQuill Editor */}
        <div className="mt-8">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            placeholder="Nhập nội dung bài viết của bạn..."
            className="min-h-80 sm:min-h-[400px] w-full rounded-lg border border-slate-300"
            required
            value={formData.content || ""}
            onChange={(value) => {
              setFormData({ ...formData, content: value });
              setTimeout(() => {
                const quillEditor = quillRef.current.getEditor();
                const height = quillEditor.root.scrollHeight;
                quillEditor.root.style.height = `${height}px`; // tự động điều chỉnh chiều cao
              }, 100);
            }}
            modules={modules}
            formats={formats}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            type="submit"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 transition h-14 text-white font-semibold px-8 text-md rounded-md"
          >
            Đăng bài viết
          </Button>

          {/* Nút quay lại Dashboard */}
          <Link
            to="/dashboard?tab=dashboard" // Đường dẫn đến trang Dashboard
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition h-14 flex items-center justify-center text-white font-semibold px-8 text-md rounded-md mt-4 sm:mt-0"
          >
            Quay lại Dashboard
          </Link>
        </div>

        {createPostError && (
          <p className="text-red-600 mt-2 text-sm">{createPostError}</p>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
