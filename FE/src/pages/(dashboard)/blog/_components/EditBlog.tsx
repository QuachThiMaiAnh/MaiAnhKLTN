// Import các thư viện và component cần thiết
import { Blog } from "@/common/types/Blog"; // Kiểu dữ liệu cho bài viết
import { useToast } from "@/components/ui/use-toast"; // Hook hiển thị thông báo toast
import { uploadFile } from "@/lib/upload"; // Hàm upload ảnh (ví dụ Cloudinary)
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // Quản lý form hiệu quả
import ReactQuill from "react-quill"; // Editor hỗ trợ định dạng văn bản
import "react-quill/dist/quill.snow.css"; // Giao diện cho ReactQuill
import { useNavigate, useParams } from "react-router-dom"; // Đọc URL param và điều hướng

const EditBlog = () => {
  const { id } = useParams<{ id: string }>(); // Lấy `id` bài viết từ URL

  // Khởi tạo form với react-hook-form
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Blog>();

  // State quản lý: danh mục, nội dung editor, ảnh xem trước, file ảnh mới, trạng thái loading
  const [categories, setCategories] = useState<any[]>([]);
  const [value, setValueEditor] = useState(""); // Nội dung trong ReactQuill
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Ảnh hiện tại
  const [imageFile, setImageFile] = useState<File | null>(null); // File ảnh mới nếu có
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const categoryValue = watch("category"); // Theo dõi giá trị danh mục hiện tại

  // Cập nhật tiêu đề tab trình duyệt
  useEffect(() => {
    document.title = "Cập Nhật Bài Viết";
  }, [id]);

  // Gọi API lấy thông tin bài viết và danh mục khi mở trang
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogRes = await axios.get(
          `http://localhost:8080/api/blogs/${id}`
        );
        const blog = blogRes.data;

        // Gán dữ liệu bài viết vào form và editor
        setValue("title", blog.title);
        setValue("category", blog.category);
        setValue("author", blog.author);
        setValue("description", blog.description);
        setValue("content", blog.content);
        setPreviewImage(blog.image); // Hiển thị ảnh cũ
        setValueEditor(blog.content); // Hiển thị nội dung cũ trong editor
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bài viết:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải thông tin bài viết.",
        });
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesRes = await axios.get(
          "http://localhost:8080/api/category"
        );
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh mục từ server.",
        });
      }
    };

    fetchBlog(); // Lấy thông tin bài viết cần sửa
    fetchCategories(); // Lấy danh mục
  }, [id, setValue, toast]);

  // Cập nhật giá trị nội dung khi gõ trong ReactQuill
  const handleChange = (content: string) => {
    setValueEditor(content);
    setValue("content", content);
  };

  // Khi người dùng chọn ảnh mới → đọc base64 để xem trước
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // Hiển thị ảnh preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Gửi form khi nhấn nút "Cập nhật"
  const onSubmit = async (data: Blog) => {
    // Nếu không có ảnh nào → báo lỗi
    if (!imageFile && !previewImage) {
      alert("Vui lòng chọn một ảnh!");
      return;
    }

    setLoading(true); // Bật trạng thái loading

    try {
      // Tạo FormData để gửi dữ liệu bài viết
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("author", data.author);
      formData.append("description", data.description);
      formData.append("content", data.content);

      // Nếu có ảnh mới → upload lên cloud và dùng ảnh mới
      if (imageFile) {
        const uploadedImageUrl = await uploadFile(imageFile);
        formData.append("image", uploadedImageUrl);
      } else if (previewImage) {
        formData.append("image", previewImage); // Giữ ảnh cũ
      }

      // Gửi PUT request cập nhật blog
      const response = await axios.put(
        `http://localhost:8080/api/blogs/${id}`,
        formData
      );

      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Bài viết đã được cập nhật thành công!",
      });
      navigate("/admin/blogs"); // Quay lại trang danh sách blog
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Có lỗi xảy ra khi cập nhật bài viết!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4 uppercase">
        Chỉnh sửa bài viết
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
            value={
              categories.length > 0
                ? categories.find((cat) => cat._id === watch("category"))?._id
                : ""
            }
            onChange={(e) => {
              if (e.target.value !== categoryValue) {
                setValue("category", e.target.value);
              }
            }}
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
          <input
            {...register("author", { required: "Tác giả là bắt buộc" })}
            id="author"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Ảnh */}
        <div>
          <label htmlFor="image" className="block text-lg font-medium mb-2">
            Chọn ảnh
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {/* Ảnh xem trước */}
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

        {/* Nội dung */}
        <div>
          <label htmlFor="content" className="block text-lg font-medium mb-2">
            Nội dung
          </label>
          <ReactQuill
            theme="snow"
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
            formats={[
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
            ]}
          />
          {errors.content && (
            <span className="text-red-500">{errors.content.message}</span>
          )}
        </div>

        {/* Nút cập nhật */}
        <div>
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white bg-blue-500 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
