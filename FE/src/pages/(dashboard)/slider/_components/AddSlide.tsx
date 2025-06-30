import { FormValuesSlide } from "@/common/types/Slide";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const AddSlider = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Preview ảnh chính
  const [bgImagePreview, setBgImagePreview] = useState<string | null>(null); // Preview ảnh nền
  const { toast } = useToast();

  // Khởi tạo form sử dụng react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValuesSlide>();

  const type = watch("type"); // Theo dõi giá trị loại slide (homepage | product)
  const features = watch("features") || []; // Theo dõi danh sách tính năng
  const { id } = useParams(); // Nếu có ID trong params, có thể dùng để phân biệt create/edit

  // Cập nhật tiêu đề tab khi không có ID (thêm mới)
  useEffect(() => {
    if (!id) document.title = "Thêm Mới Slider";
  }, [id]);

  // Submit form
  const onSubmit = async (data: FormValuesSlide) => {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("title", data.title);

    // Tùy loại slide sẽ có các trường riêng
    if (data.type === "homepage") {
      if (data.subtitle) formData.append("subtitle", data.subtitle);
      if (data.description) formData.append("description", data.description);
      if (data.features)
        formData.append("features", JSON.stringify(data.features)); // Gửi JSON.stringify
      if (data.price) formData.append("price", data.price.toString());
    }

    if (data.type === "product") {
      if (data.promotionText)
        formData.append("promotionText", data.promotionText);
      if (data.textsale) formData.append("textsale", data.textsale);
    }

    // Ảnh chính
    if (data.image instanceof FileList && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    // Ảnh nền
    if (data.backgroundImage && data.backgroundImage[0])
      formData.append("backgroundImage", data.backgroundImage[0]);

    try {
      await axios.post("http://localhost:8080/api/sliders", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Slide đã được tạo thành công!",
      });

      navigate("/admin/sliders"); // Điều hướng về danh sách
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Có lỗi sảy ra khi tạo slide!",
      });
    }
  };

  // Thêm mới dòng tính năng (cho type homepage)
  const addFeature = () => setValue("features", [...features, ""]);

  // Xóa dòng tính năng
  const removeFeature = (index: number) =>
    setValue(
      "features",
      features.filter((_, i) => i !== index)
    );

  // Xử lý khi chọn ảnh → tạo preview để hiển thị
  const handleImagePreview = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "backgroundImage"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "image") {
          setImagePreview(reader.result as string);
        } else if (type === "backgroundImage") {
          setBgImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Xóa ảnh đã chọn (preview + giá trị form)
  const handleRemoveImage = (type: "image" | "backgroundImage") => {
    if (type === "image") {
      setImagePreview(null);
      setValue("image", null);
    } else {
      setBgImagePreview(null);
      setValue("backgroundImage", null);
    }
  };

  return (
    <div className="px-10 md:px-20 mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 text-center">
        Tạo Mới Slide
      </h2>

      {/* Form khởi tạo slide */}
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        {/* =============== Chọn loại slide =============== */}
        <div className="mb-4 sm:mb-6">
          <label
            htmlFor="type"
            className="block text-base sm:text-lg text-gray-700"
          >
            Loại Slide
          </label>
          <select
            id="type"
            {...register("type", { required: "Vui lòng chọn loại slide." })}
            className={`mt-2 p-2 sm:p-3 w-full border ${
              errors.type ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
          >
            <option value="">Chọn Loại Slide</option>
            <option value="homepage">Slide Homepage</option>
            <option value="product">Slide Product</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        {/* =============== Loại HOMEPAGE =============== */}
        {type === "homepage" && (
          <>
            {/* Tiêu đề */}
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="title"
                className="block text-base sm:text-lg text-gray-700"
              >
                Tiêu Đề
              </label>
              <input
                id="title"
                {...register("title", { required: "Tiêu đề là bắt buộc." })}
                className={`mt-2 p-2 sm:p-3 w-full border ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Các trường phụ: subtitle, description, price */}
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="subtitle"
                className="block text-base sm:text-lg text-gray-700"
              >
                Phụ Đề
              </label>
              <input
                id="subtitle"
                {...register("subtitle")}
                className="mt-2 p-2 sm:p-3 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="description"
                className="block text-base sm:text-lg text-gray-700"
              >
                Mô Tả
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows={4}
                className="mt-2 p-2 sm:p-3 w-full border border-gray-300 rounded-lg"
              />
            </div>

            {/* Tính năng (mảng) */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-base sm:text-lg text-gray-700">
                Tính Năng
              </label>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const updated = [...features];
                      updated[index] = e.target.value;
                      setValue("features", updated);
                    }}
                    className="p-2 sm:p-3 border border-gray-300 rounded-lg w-full"
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

            {/* Giá */}
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="price"
                className="block text-base sm:text-lg text-gray-700"
              >
                Giá
              </label>
              <input
                type="number"
                id="price"
                {...register("price")}
                className="mt-2 p-2 sm:p-3 w-full border border-gray-300 rounded-lg"
              />
            </div>

            {/* Ảnh chính & nền */}
            <ImageFields
              imagePreview={imagePreview}
              bgImagePreview={bgImagePreview}
              register={register}
              handleImagePreview={handleImagePreview}
              handleRemoveImage={handleRemoveImage}
            />
          </>
        )}

        {/* =============== Loại PRODUCT =============== */}
        {type === "product" && (
          <>
            {/* Tiêu đề */}
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="title"
                className="block text-base sm:text-lg text-gray-700"
              >
                Tiêu Đề
              </label>
              <input
                id="title"
                {...register("title", { required: "Tiêu đề là bắt buộc." })}
                className={`mt-2 p-2 sm:p-3 w-full border ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Text nổi bật và % giảm */}
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="promotionText"
                className="block text-base sm:text-lg text-gray-700"
              >
                Text nổi bật Khuyến Mãi
              </label>
              <input
                id="promotionText"
                {...register("promotionText")}
                className="mt-2 p-2 sm:p-3 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="textsale"
                className="block text-base sm:text-lg text-gray-700"
              >
                Text khuyến mãi bao nhiêu %
              </label>
              <input
                id="textsale"
                {...register("textsale")}
                className="mt-2 p-2 sm:p-3 w-full border border-gray-300 rounded-lg"
              />
            </div>

            {/* Ảnh chính & nền */}
            <ImageFields
              imagePreview={imagePreview}
              bgImagePreview={bgImagePreview}
              register={register}
              handleImagePreview={handleImagePreview}
              handleRemoveImage={handleRemoveImage}
            />
          </>
        )}

        {/* Nút submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 mt-6 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          {isSubmitting ? "Đang Tạo..." : "Tạo Slide"}
        </button>
      </form>
    </div>
  );
};

// =============== Component con xử lý ảnh ===============
const ImageFields = ({
  imagePreview,
  bgImagePreview,
  register,
  handleImagePreview,
  handleRemoveImage,
}) => (
  <div className="flex flex-col xl:flex-row gap-10 lg:gap-20">
    {/* Ảnh chính */}
    <div className="mb-4 sm:mb-6">
      <div className="md:flex items-center gap-5">
        <label
          htmlFor="image"
          className="block text-gray-700 text-base sm:text-lg"
        >
          Ảnh Chính:
        </label>
        <input
          type="file"
          id="image"
          {...register("image")}
          onChange={(e) => handleImagePreview(e, "image")}
          className="max-w-full md:max-w-xs"
        />
      </div>
      {imagePreview && (
        <div className="mt-2 relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-[250px] h-[200px] object-contain mx-auto rounded-lg shadow-md"
          />
          <button
            onClick={() => handleRemoveImage("image")}
            className="absolute top-6 right-0 bg-red-500 text-white rounded px-2 py-1"
          >
            X
          </button>
        </div>
      )}
    </div>

    {/* Ảnh nền */}
    <div className="mb-4 sm:mb-6">
      <div className="md:flex items-center gap-5">
        <label
          htmlFor="backgroundImage"
          className="block text-gray-700 text-base sm:text-lg"
        >
          Ảnh Nền:
        </label>
        <input
          type="file"
          id="backgroundImage"
          {...register("backgroundImage")}
          onChange={(e) => handleImagePreview(e, "backgroundImage")}
          className="max-w-full md:max-w-xs"
        />
      </div>
      {bgImagePreview && (
        <div className="mt-2 relative">
          <img
            src={bgImagePreview}
            alt="Background Preview"
            className="w-[250px] h-[200px] object-contain mx-auto rounded-lg shadow-md"
          />
          <button
            onClick={() => handleRemoveImage("backgroundImage")}
            className="absolute top-6 right-0 bg-red-500 text-white rounded px-2 py-1"
          >
            X
          </button>
        </div>
      )}
    </div>
  </div>
);

export default AddSlider;
