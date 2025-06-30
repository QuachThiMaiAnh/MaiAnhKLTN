// Nhập các dependencies cần thiết
import { Blog } from "@/common/types/Blog";
import { useToast } from "@/components/ui/use-toast"; // Hook hiển thị thông báo
import { uploadFile } from "@/lib/upload"; // Hàm upload file (ví dụ lên Cloudinary)
import { useUser } from "@clerk/clerk-react"; // Lấy thông tin người dùng đăng nhập
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // Thư viện quản lý form
import ReactQuill from "react-quill"; // Rich Text Editor
import "react-quill/dist/quill.snow.css"; // Giao diện React Quill
import { useNavigate, useParams } from "react-router-dom"; // Điều hướng và đọc param từ URL

const AddBlog = () => {
  // Lấy thông tin người dùng từ Clerk
  const { user } = useUser();

  // Khởi tạo useForm với kiểu dữ liệu Blog, set giá trị mặc định cho category và author
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

  // State lưu danh mục, nội dung editor, ảnh preview, file ảnh, loading và điều hướng
  const [categories, setCategories] = useState<any[]>([]);
  const [value, setValueEditor] = useState(""); // Giá trị từ ReactQuill
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Ảnh xem trước
  const [imageFile, setImageFile] = useState<File | null>(null); // File ảnh được chọn
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams(); // Dùng để kiểm tra nếu đang ở chế độ edit

  // Đặt tiêu đề cho tab khi tạo mới blog
  useEffect(() => {
    if (!id) document.title = "Thêm Mới Bài Viết";
  }, [id]);

  // Gọi API lấy danh mục blog từ server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category");
        setCategories(response.data); // Lưu vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể lấy danh mục từ server",
        });
      }
    };

    fetchCategories(); // Thực thi ngay khi component mount
  }, []);

  // Cấu hình định dạng cho ReactQuill
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

  // Khi thay đổi nội dung editor → cập nhật state + đồng bộ với react-hook-form
  const handleChange = (content: string) => {
    setValueEditor(content);
    setValue("content", content);
  };

  // Khi chọn ảnh → lưu file, tạo preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file); // Lưu file để upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // Hiển thị ảnh xem trước
      };
      reader.readAsDataURL(file);
    }
  };

  // Gửi form khi người dùng nhấn submit
  const onSubmit = async (data: Blog) => {
    // Nếu chưa có ảnh → báo lỗi
    if (!imageFile) {
      alert("Vui lòng chọn một ảnh!");
      return;
    }

    setLoading(true); // Bật trạng thái loading

    try {
      // Upload ảnh lên Cloudinary
      const imageUrl = await uploadFile(imageFile);
      if (!imageUrl) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải ảnh lên Cloudinary",
        });
        return;
      }

      // Tạo FormData gửi lên backend
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("author", data.author);
      formData.append("description", data.description);
      formData.append("content", data.content);
      formData.append("image", imageUrl); // Gửi link ảnh đã upload

      // Gọi API tạo bài viết
      const response = await axios.post(
        "http://localhost:8080/api/blogs",
        formData
      );

      // Thành công → hiện thông báo và điều hướng
      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Bài viết đã được tạo thành công!",
      });
      navigate("/admin/blogs");
    } catch (error) {
      // Gặp lỗi khi gửi → hiển thị thông báo chi tiết
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
              minLength: { value: 3, message: "Ít nhất 3 ký tự" },
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

        {/* Tác giả (ẩn) */}
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

        {/* Chọn ảnh */}
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
          {/* Xem trước ảnh */}
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

        {/* Nút Gửi */}
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
