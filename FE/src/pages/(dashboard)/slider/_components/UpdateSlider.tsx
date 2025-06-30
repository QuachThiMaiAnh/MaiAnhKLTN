import { FormValuesSlide } from "@/common/types/Slide";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const UpdateSlider = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const { toast } = useToast();

  // ============ State cho ảnh và lỗi ============
  const [currentImage, setCurrentImage] = useState<string | null>(null); // Ảnh chính hiện tại
  const [currentBgImage, setCurrentBgImage] = useState<string | null>(null); // Ảnh nền hiện tại
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Preview ảnh chính mới
  const [previewBgImage, setPreviewBgImage] = useState<string | null>(null); // Preview ảnh nền mới
  const [error, setError] = useState("");

  // ============ Khởi tạo form ============
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValuesSlide>({
    defaultValues: {
      type: "",
      features: [],
      image: undefined,
      backgroundImage: undefined,
    },
  });

  // ============ Theo dõi các giá trị cần thiết ============
  const type = watch("type");
  const features = watch("features") || [];
  const imageFile = watch("image");
  const bgImageFile = watch("backgroundImage");

  useEffect(() => {
    document.title = "Cập Nhật Slider";
  }, [id]);

  // ============ Tải dữ liệu từ server ============
  useEffect(() => {
    if (!id) {
      setError("ID không tồn tại trong URL.");
      return;
    }

    const fetchSlider = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/sliders/${id}`
        );
        const {
          type,
          title,
          subtitle,
          description,
          price,
          features,
          promotionText,
          textsale,
          image,
          backgroundImage,
        } = response.data;

        // Gán dữ liệu vào form
        setValue("type", type);
        setValue("title", title);
        setValue("subtitle", subtitle || "");
        setValue("description", description || "");
        setValue("price", price || 0);
        setValue("features", features || []);
        setValue("promotionText", promotionText || "");
        setValue("textsale", textsale || "");
        setCurrentImage(image);
        setCurrentBgImage(backgroundImage);
      } catch (err) {
        setError("Không thể tải dữ liệu slide.");
      }
    };

    fetchSlider();
  }, [id, setValue]);

  // ============ Tạo preview ảnh nếu người dùng chọn ảnh mới ============
  useEffect(() => {
    if (imageFile instanceof FileList && imageFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(imageFile[0]);
    } else {
      setPreviewImage(null);
    }
  }, [imageFile]);

  useEffect(() => {
    if (bgImageFile?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewBgImage(reader.result as string);
      reader.readAsDataURL(bgImageFile[0]);
    } else {
      setPreviewBgImage(null);
    }
  }, [bgImageFile]);

  // ============ Gửi dữ liệu cập nhật ============
  const onSubmit = async (data: FormValuesSlide) => {
    try {
      const formData = new FormData();
      formData.append("type", data.type);
      formData.append("title", data.title);

      // Nếu là homepage: thêm subtitle, mô tả, tính năng, giá
      if (data.type === "homepage") {
        formData.append("subtitle", data.subtitle || "");
        formData.append("description", data.description || "");
        formData.append("features", JSON.stringify(data.features || []));
        formData.append("price", data.price?.toString() || "0");
      }

      // Nếu là product: thêm text khuyến mãi
      if (data.type === "product") {
        formData.append("promotionText", data.promotionText || "");
        formData.append("textsale", data.textsale || "");
      }

      // Nếu có ảnh mới → thêm vào formData
      if (data.image?.[0]) formData.append("image", data.image[0]);
      if (data.backgroundImage?.[0])
        formData.append("backgroundImage", data.backgroundImage[0]);

      // Gửi request PUT
      await axios.put(`http://localhost:8080/api/sliders/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Slide đã được cập nhật thành công!",
      });
      navigate("/admin/sliders");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Có lỗi sảy ra khi cập nhật slide!",
      });
    }
  };

  // ============ Xử lý tính năng động ============
  const addFeature = () => setValue("features", [...features, ""]);

  const removeFeature = (index: number) => {
    setValue(
      "features",
      features.filter((_, i) => i !== index)
    );
  };

  // ============ Xóa ảnh preview ============
  const handleRemoveImage = (type: "image" | "backgroundImage") => {
    if (type === "image") {
      setPreviewImage(null);
      setValue("image", null);
    } else {
      setPreviewBgImage(null);
      setValue("backgroundImage", null);
    }
  };

  // ============ Giao diện form ============
  return (
    <div className="px-10 md:px-20 mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 text-center">
        Cập Nhật Slider
      </h2>

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        {/* ==== Chọn loại slide ==== */}
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-lg font-medium text-gray-700"
          >
            Loại Slide
          </label>
          <select
            id="type"
            {...register("type", { required: "Vui lòng chọn loại slide." })}
            className={`mt-2 p-2 w-full border ${
              errors.type ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
          >
            <option value="">Chọn Loại Slide</option>
            <option value="homepage">Slide Homepage</option>
            <option value="product">Slide Product</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>

        {/* ==== Tiêu đề ==== */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-lg font-medium text-gray-700"
          >
            Tiêu Đề
          </label>
          <input
            id="title"
            {...register("title", { required: "Tiêu đề là bắt buộc." })}
            className={`mt-2 p-2 w-full border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* ==== Các trường nếu là homepage ==== */}
        {type === "homepage" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="subtitle"
                className="block text-lg font-medium text-gray-700"
              >
                Phụ Đề
              </label>
              <input
                id="subtitle"
                {...register("subtitle")}
                className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-lg font-medium text-gray-700"
              >
                Mô Tả
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows={4}
                className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-lg font-medium text-gray-700"
              >
                Giá
              </label>
              <input
                type="number"
                id="price"
                {...register("price")}
                className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            {/* Tính năng */}
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Tính Năng
              </label>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const updatedFeatures = [...features];
                      updatedFeatures[index] = e.target.value;
                      setValue("features", updatedFeatures);
                    }}
                    className="p-2 w-full border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-2 text-red-600"
                  >
                    Xóa
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="mt-2 text-blue-600"
              >
                + Thêm Tính Năng
              </button>
            </div>
          </>
        )}

        {/* ==== Các trường nếu là product ==== */}
        {type === "product" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="promotionText"
                className="block text-lg font-medium text-gray-700"
              >
                Text Khuyến Mãi
              </label>
              <input
                id="promotionText"
                {...register("promotionText")}
                className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="textsale"
                className="block text-lg font-medium text-gray-700"
              >
                Phần Trăm Giảm Giá
              </label>
              <input
                id="textsale"
                {...register("textsale")}
                className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
          </>
        )}

        {/* ==== Ảnh chính và ảnh nền ==== */}
        <div className="flex flex-col xl:flex-row gap-10 mt-20 justify-around">
          {/* Ảnh chính */}
          <ImageBlock
            label="Ảnh Chính"
            currentImage={currentImage}
            previewImage={previewImage}
            register={register("image")}
            onRemove={() => handleRemoveImage("image")}
          />
          {/* Ảnh nền */}
          <ImageBlock
            label="Ảnh Nền"
            currentImage={currentBgImage}
            previewImage={previewBgImage}
            register={register("backgroundImage")}
            onRemove={() => handleRemoveImage("backgroundImage")}
          />
        </div>

        {/* Nút submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
        >
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật Slide"}
        </button>
      </form>
    </div>
  );
};

// ==== Component con xử lý hình ảnh (reusable cho ảnh chính & ảnh nền) ====
const ImageBlock = ({
  label,
  currentImage,
  previewImage,
  register,
  onRemove,
}) => (
  <div className="mb-4">
    <div className="flex flex-col lg:flex-row lg:items-center">
      <label className="block w-32 text-lg font-medium text-gray-700">
        {label}:
      </label>
      <input
        type="file"
        {...register}
        className="block w-full border border-gray-300 rounded-lg"
      />
    </div>
    {currentImage && (
      <div className="mt-2">
        <p className="text-gray-700">Ảnh Hiện Tại:</p>
        <img
          src={currentImage}
          alt="Current"
          className="w-[250px] h-[200px] object-contain mx-auto rounded-lg shadow-md"
        />
      </div>
    )}
    {previewImage && (
      <div className="mt-2 relative">
        <p className="text-gray-700">Ảnh đã chọn:</p>
        <img
          src={previewImage}
          alt="Preview"
          className="w-[250px] h-[200px] object-contain mx-auto rounded-lg shadow-md"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-6 right-0 bg-red-500 text-white rounded px-2 py-1"
        >
          X
        </button>
      </div>
    )}
  </div>
);

export default UpdateSlider;
