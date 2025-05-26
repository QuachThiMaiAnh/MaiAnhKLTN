import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

interface FormData {
  title: string;
}

const AddLogoPage = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null); // State lưu trữ ảnh
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // State kiểm tra form đã được submit chưa
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  
    useEffect(() => {
      if (!id) document.title = "Thêm Mới Logo";
    }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file); // Lưu trữ file vào state
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitted(true); // Đánh dấu form đã được submit

    if (!image) {
      // Nếu chưa chọn ảnh, hiện thông báo lỗi
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Vui lòng chọn hình ảnh!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("image", image);

    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/logo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Logo đã được tạo thành công!",
      });
      navigate("/admin/logos");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Có lỗi xảy ra khi tạo Logo!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:px-20 mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Thêm Mới Logo
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Tiêu đề */}
        <div className="mb-5">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Tiêu Đề:
          </label>
          <input
            type="text"
            placeholder="Tiêu đề"
            id="title"
            {...register("title", { required: "Tiêu đề không được để trống!" })}
            className={`mt-1 block w-full p-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Hình ảnh */}
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Hình Ảnh Logo:
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className={`mt-1 block w-full border ${
              isSubmitted && !image ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {isSubmitted && !image && (
            <p className="text-red-500 text-sm mt-1">
              Hình ảnh không được để trống!
            </p>
          )}
        </div>

        {/* Xem trước ảnh */}
        {preview && (
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-700">
              Xem Trước Ảnh Được Thêm:
            </label>
            <div className="mt-2 w-full flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-52 h-32 object-contain rounded-md shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Nút submit */}
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 mt-6 rounded hover:bg-blue-600 shadow-sm transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Đang Thêm..." : "Thêm Logo"}
        </button>
      </form>
    </div>
  );
};

export default AddLogoPage;
