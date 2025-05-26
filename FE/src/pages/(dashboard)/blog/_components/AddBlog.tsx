import { Blog } from "@/common/types/Blog";
import { useToast } from "@/components/ui/use-toast";
import { uploadFile } from "@/lib/upload";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";

const AddBlog = () => {
  const { user } = useUser();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<Blog>({
    defaultValues: {
      category: "",
      author: user?.fullName || "",
    },
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [value, setValueEditor] = useState(""); // Lưu giá trị editor của React Quill
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Lưu ảnh xem trước
  const [imageFile, setImageFile] = useState<File | null>(null); // Lưu file ảnh
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    if (!id) document.title = "Thêm Mới Bài Viết";
  }, [id]);

  useEffect(() => {
    // Hàm lấy danh mục từ API
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category"); // Đường dẫn API
        setCategories(response.data); // Lưu danh mục vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể lấy danh mục từ server",
        });
      }
    };

    fetchCategories(); // Gọi hàm lấy danh mục
  }, []);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  // Hàm xử lý thay đổi nội dung của React Quill
  const handleChange = (content: string) => {
    setValueEditor(content); // Cập nhật giá trị cho editor
    setValue("content", content); // Lưu vào React Hook Form
  };

  // Hàm xử lý khi chọn file ảnh
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file); // Lưu file vào state
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // Hiển thị ảnh xem trước
      };
      reader.readAsDataURL(file); // Đọc file dưới dạng base64
    }
  };

  // Hàm xử lý submit form
  const onSubmit = async (data: Blog) => {
    if (!imageFile) {
      alert("Vui lòng chọn một ảnh!");
      return;
    }

    setLoading(true);

    try {
      // Upload ảnh lên Cloudinary
      const imageUrl = await uploadFile(imageFile); // Lấy URL ảnh từ Cloudinary
      if (!imageUrl) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải ảnh lên Cloudinary",
        });
        return;
      }

      // Tạo FormData để gửi yêu cầu POST
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("author", data.author);
      formData.append("description", data.description);
      formData.append("content", data.content);
      formData.append("image", imageUrl); // Gửi URL ảnh đã upload từ frontend

      // Gửi yêu cầu POST lên BE
      const response = await axios.post(
        "http://localhost:8080/api/blogs",
        formData
      );
      console.log("Bài viết đã được tạo:", response.data);
      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Bài viết đã được tạo thành công!",
      });
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Có lỗi sảy ra khi tạo bài viết!",
      });
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          description: `Có lỗi xảy ra: ${
            error.response?.data.message || error.message
          }`,
        });
      } else {
        alert("Có lỗi không xác định.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-center font-semibold mb-5">
        Thêm bài viết Mới
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Tiêu đề */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium mb-2">
            Tiêu đề
          </label>
          <input
            {...register("title", {
              required: "Tiêu đề là bắt buộc",
              minLength: {
                value: 3,
                message: "Tiêu đề phải có ít nhất 3 ký tự",
              },
            })}
            id="title"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}
        </div>

        {/* Danh mục */}
        <div>
          <label htmlFor="category" className="block text-lg font-medium mb-2">
            Danh mục
          </label>
          <select
            {...register("category", { required: "Danh mục là bắt buộc" })}
            id="category"
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Chọn danh mục
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-red-500">{errors.category.message}</span>
          )}
        </div>
        {/* Tác giả */}
        <div className="hidden">
          <label htmlFor="author" className="block text-lg font-medium mb-2">
            Tác giả
          </label>
          <input
            {...register("author", { required: "Tác giả là bắt buộc" })}
            id="author"
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue={user?.fullName || ""}
          />
          {errors.author && (
            <span className="text-red-500">{errors.author.message}</span>
          )}
        </div>
        {/* Hình ảnh */}
        <div>
          <label htmlFor="image" className="block text-lg font-medium mb-2">
            Chọn ảnh
          </label>
          <input
            type="file"
            id="image"
            {...register("image", { required: "Ảnh là bắt buộc" })}
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-md"
          />
          {errors.image && (
            <span className="text-red-500">{errors.image.message}</span>
          )}

          {/* Hiển thị ảnh xem trước */}
          {previewImage && (
            <div className="mt-4">
              <img
                src={previewImage}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>
        {/* Mô tả */}
        <div>
          <label
            htmlFor="description"
            className="block text-lg font-medium mb-2"
          >
            Mô tả
          </label>
          <textarea
            {...register("description", { required: "Mô tả là bắt buộc" })}
            id="description"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}
        </div>
        {/* Nội dung (React Quill Editor) */}
        <div>
          <label htmlFor="content" className="block text-lg font-medium mb-2">
            Nội dung
          </label>
          <ReactQuill
            theme="snow"
            id="content"
            {...register("content", { required: "Nội dung là bắt buộc" })}
            value={value}
            onChange={handleChange}
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
            formats={formats}
          />
          {errors.content && (
            <span className="text-red-500">{errors.content.message}</span>
          )}
        </div>
        {/* Nút Submit */}
        <div>
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white bg-blue-500 rounded-md ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Gửi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
