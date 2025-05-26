import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

interface FormData {
  title: string;
}

const UpdateLogoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
    useEffect(() => {
       document.title = "Cập Nhật Logo";
    }, [id]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    // Fetch logo data
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/logo/${id}`);
        const logoData = response.data;
        reset({
          title: logoData.title,
        });
        setPreview(logoData.image);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Thất bại",
          description: "Có lỗi xảy ra khi lấy thông tin logo!",
        });
      }
    };

    fetchLogo();
  }, [id, reset, toast]);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:8080/api/logo/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Logo đã được cập nhật thành công!",
      });
      navigate("/admin/logos");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Có lỗi xảy ra khi cập nhật logo!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:px-20 mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Cập Nhật Logo
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Tiêu đề */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Tiêu Đề
          </label>
          <input
            type="text"
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
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Hình Ảnh Logo
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full mb-6 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Xem trước ảnh */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Hình Ảnh Hiện Tại
          </label>
          {preview && (
            <div className="mt-2 w-full flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-52 h-32 object-contain rounded-md shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Nút cập nhật */}
        <button
          type="submit"
          className={`bg-blue-500 mt-5 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-sm transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Đang Cập Nhật..." : "Cập Nhật Logo"}
        </button>
      </form>
    </div>
  );
};

export default UpdateLogoPage;
