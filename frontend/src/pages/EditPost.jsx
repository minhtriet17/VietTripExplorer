import React, { useEffect, useState, useRef } from "react";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import { ResizableImage } from "@/lib/ResizableImage";

import TextStyle from "@tiptap/extension-text-style";
import FontSize from "@/lib/FontSize";

const EditPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();

  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploading, setImageUploading] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
  });

  const [updatePostError, setUpdatePostError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);

        const data = await res.json();

        if (!res.ok) {
          console.log(data.message);
          setUpdatePostError(data.message);

          return;
        }

        if (res.ok) {
          setUpdatePostError(null);
          setFormData(data.posts[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  

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
      const res = await fetch(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast("Something went wrong! Please try again.");
        setUpdatePostError(data.message);

        return;
      }

      if (res.ok) {
        toast("Article Published Successfully!");
        setUpdatePostError(null);

        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      toast("Something went wrong! Please try again.");
      setUpdatePostError("Something went wrong! Please try again.");
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

  // Hàm updateFormData để cập nhật formData
  const updateFormData = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,  // Cập nhật trường tương ứng trong formData
    }));
  };

  useEffect(() => {
    if (editor && formData.content) {
      editor.commands.setContent(formData.content); // đặt lại nội dung khi formData thay đổi
    }
  }, [formData.content, editor]);

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
        Chỉnh sửa bài viết
      </h1>

      <form className="space-y-8" onSubmit={handleSubmit}>
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
            value={formData.title}
          />

          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                category: value,
              })
            }
            value={formData.category}
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

        <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            type="submit"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 transition h-14 text-white font-semibold px-8 text-md rounded-md"
          >
            Cập nhật bài viết
          </Button>

          {/* Nút quay lại Dashboard */}
          <Link
            to="/dashboard?tab=dashboard" // Đường dẫn đến trang Dashboard
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition h-14 flex items-center justify-center text-white font-semibold px-8 text-md rounded-md mt-4 sm:mt-0"
          >
            Quay lại Dashboard
          </Link>
        </div>

        {updatePostError && (
          <p className="text-red-600 mt-2 text-sm">{updatePostError}</p>
        )}
      </form>
    </div>
  );
};

export default EditPost;
