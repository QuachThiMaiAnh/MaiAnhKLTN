import { Blog } from "@/common/types/Blog";
import { useToast } from "@/components/ui/use-toast";
import { uploadFile } from "@/lib/upload";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Blog>();
  const [categories, setCategories] = useState<any[]>([]);
  const [value, setValueEditor] = useState(""); // Lưu giá trị editor của React Quill
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Lưu ảnh xem trước
  const [imageFile, setImageFile] = useState<File | null>(null); // Lưu file ảnh
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const categoryValue = watch("category");

  useEffect(() => {
     document.title = "Cập Nhật Bài Viết";
  }, [id]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogRes = await axios.get(`http://localhost:8080/api/blogs/${id}`);
        const blog = blogRes.data;
  
        // Hiển thị dữ liệu blog trước
        setValue("title", blog.title);
        setValue("category", blog.category);
        setValue("author", blog.author);
        setValue("description", blog.description);
        setValue("content", blog.content);
        setPreviewImage(blog.image);
        setValueEditor(blog.content);
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
        const categoriesRes = await axios.get("http://localhost:8080/api/category");
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
  
    // Gọi API cho blog trước
    fetchBlog();
    fetchCategories();
  }, [id, setValue, toast]);
  

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
    if (!imageFile && !previewImage) {
      alert("Vui lòng chọn một ảnh!");
      return;
    }

    setLoading(true);
    try {
      // Tạo FormData để gửi yêu cầu PUT
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("author", data.author);
      formData.append("description", data.description);
      formData.append("content", data.content);

      // Nếu có ảnh mới, upload lên Cloudinary và thêm URL vào formData
      if (imageFile) {
        const uploadedImageUrl = await uploadFile(imageFile);
        formData.append("image", uploadedImageUrl);
      } else if (previewImage) {
        formData.append("image", previewImage); // Sử dụng ảnh đã có sẵn từ backend
      }

      // Gửi yêu cầu PUT lên BE
      const response = await axios.put(
        `http://localhost:8080/api/blogs/${id}`,
        formData
      );

      console.log("Bài viết đã được cập nhật:", response.data);
      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Bài viết đã được cập nhật thành công!",
      });
      navigate("/admin/blogs"); // Quay lại trang danh sách
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

        {/* Tác giả */}
        <div className="hidden">
          <label htmlFor="author" className="block text-lg font-medium mb-2">
            Tác giả
          </label>
          <input
            {...register("author", { required: "Tác giả là bắt buộc" })}
            id="author"
            className="w-full p-2 border border-gray-300 rounded-md"
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
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />

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
            value={value} // Giá trị nội dung được truyền vào ReactQuill
            onChange={handleChange} // Xử lý thay đổi nội dung
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

        {/* Nút Submit */}
        <div>
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white bg-blue-500 rounded-md ${
              loading && "opacity-50 cursor-not-allowed"
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
