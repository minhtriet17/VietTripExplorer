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
import { toast } from "sonner";
import { getFilePreview, uploadFile } from "@/lib/appwrite/uploadImage";
import { Link, useNavigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import { ResizableImage } from "@/lib/ResizableImage";

import TextStyle from "@tiptap/extension-text-style";
import FontSize from "@/lib/FontSize";

const CreatePost = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
  });

  const [createPostError, setCreatePostError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image!");
      toast("Please select an image!");
      return;
    }

    try {
      setImageUploading(true);
      setImageUploadError(null);

      const uploadedFile = await uploadFile(file);
      const postImageUrl = getFilePreview(uploadedFile.$id);

      setFormData({ ...formData, image: postImageUrl });

      toast("Image uploaded Successfully!");
      setImageUploading(false);
      setPreviewImage(null); // Reset preview after upload
    } catch (error) {
      setImageUploadError("Image upload failed");
      console.log(error);

      toast("Image upload failed!");
      setImageUploading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // bỏ ký tự đặc biệt
      .replace(/\s+/g, "-"); // thay khoảng trắng bằng dấu gạch ngang
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.content) {
      toast("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      setIsSubmitting(true);

      const slug = generateSlug(formData.title);

      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, slug }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast("Something went wrong! Please try again.");
        setCreatePostError(data.message);
        return;
      }

      toast("Đăng bài viết thành công!");
      navigate(`/post/${data.slug}`);
    } catch (error) {
      console.error(error);
      setCreatePostError("Đã xảy ra lỗi!");
      toast("Đăng bài viết thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // disable default heading (chúng ta dùng custom)
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ResizableImage,
      TextStyle,
      FontSize,
    ],
    content: formData.content,
    onUpdate({ editor }) {
      updateFormData("content", editor.getHTML());
    },
  });

  const insertImageToEditor = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const uploadedFile = await uploadFile(file);
          const imageUrl = getFilePreview(uploadedFile.$id);
          const width = prompt("Chiều rộng ảnh (vd: 400px hoặc auto):", "auto");
          const height = prompt("Chiều cao ảnh (vd: 300px hoặc auto):", "auto");

          editor
            .chain()
            .focus()
            .setImage({ src: imageUrl, width, height })
            .run();
          toast("Ảnh đã được chèn vào bài viết!");
        } catch (error) {
          toast("Failed to upload image into editor");
        }
      }
    };
    input.click();
  };

  const toolbarButtons = [
    {
      command: "toggleBold",
      label: "B",
      isActive: () => editor?.isActive("bold"),
    },
    {
      command: "toggleItalic",
      label: "I",
      isActive: () => editor?.isActive("italic"),
    },
    {
      command: "toggleUnderline",
      label: "U",
      isActive: () => editor?.isActive("underline"),
    },
    {
      command: "toggleBulletList",
      label: "• List",
      isActive: () => editor?.isActive("bulletList"),
    },
    {
      command: "toggleOrderedList",
      label: "1. List",
      isActive: () => editor?.isActive("orderedList"),
    },
    {
      command: "setHeading",
      args: { level: 1 },
      label: "H1",
      isActive: () => editor?.isActive("heading", { level: 1 }),
    },
    {
      command: "setHeading",
      args: { level: 2 },
      label: "H2",
      isActive: () => editor?.isActive("heading", { level: 2 }),
    },
    {
      command: "setHeading",
      args: { level: 3 },
      label: "H3",
      isActive: () => editor?.isActive("heading", { level: 3 }),
    },
    { command: "setTextAlign", args: "left", label: "←" },
    { command: "setTextAlign", args: "center", label: "↔" },
    { command: "setTextAlign", args: "right", label: "→" },
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
            value={formData.title}
            id="title"
            className="flex-1 h-14 sm:h-16 border border-slate-300 rounded-lg px-6 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            onChange={(e) => updateFormData("title", e.target.value)}
          />

          <Select
            value={formData.category}
            onValueChange={(value) => updateFormData("category", value)}
          >
            <SelectTrigger className="w-full sm:w-64 h-14 sm:h-16 border border-slate-300 rounded-lg px-6 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200">
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

        {editor && (
          <div className="flex flex-wrap gap-2 border-b border-gray-300 pb-2 mb-2">
            {toolbarButtons.map(({ command, label, args, isActive }) => (
              <Button
                key={label}
                variant="outline"
                onClick={() => editor.chain().focus()[command](args).run()}
                className={isActive?.() ? "bg-gray-200" : ""}
              >
                {label}
              </Button>
            ))}

            <select
              onChange={(e) =>
                editor
                  .chain()
                  .focus()
                  .setMark("textStyle", { fontSize: e.target.value })
                  .run()
              }
              defaultValue=""
              className="border px-2 py-1 rounded text-sm"
            >
              <option value="">Cỡ chữ</option>
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
              <option value="28px">28px</option>
            </select>
          </div>
        )}

        <div className="mt-8 border border-slate-300 rounded-lg p-4">
          <div className="flex justify-end mb-2">
            <Button type="button" onClick={insertImageToEditor}>
              Thêm ảnh vào nội dung
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const newWidth = prompt(
                  "Nhập chiều rộng mới (vd: 400px hoặc auto):",
                  "auto"
                );
                const newHeight = prompt(
                  "Nhập chiều cao mới (vd: 300px hoặc auto):",
                  "auto"
                );

                if (editor && editor.isActive("image")) {
                  editor
                    .chain()
                    .focus()
                    .updateAttributes("image", {
                      width: newWidth,
                      height: newHeight,
                    })
                    .run();
                } else {
                  toast(
                    "Vui lòng chọn ảnh trong nội dung trước khi thay đổi kích thước!"
                  );
                }
              }}
            >
              Thay đổi kích thước ảnh
            </Button>
          </div>
          <EditorContent
            editor={editor}
            className="min-h-[400px] border border-slate-300 rounded-lg shadow-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white h-14 px-8 text-md rounded-md ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Đang đăng..." : "Đăng bài viết"}
          </Button>

          {/* Nút quay lại Dashboard */}
          <Link
            to="/dashboard?tab=dashboard"
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
