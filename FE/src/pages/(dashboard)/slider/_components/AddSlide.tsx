import { FormValuesSlide } from "@/common/types/Slide";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const AddSlider = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bgImagePreview, setBgImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValuesSlide>();

  const type = watch("type"); // Theo dõi loại slide
  const features = watch("features") || [];
  const { id } = useParams();
  
    useEffect(() => {
      if (!id) document.title = "Thêm Mới Slider";
    }, [id]);

  const onSubmit = async (data: FormValuesSlide) => {
    console.log(data);
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("title", data.title);

    // Nếu loại slide là homepage, thêm các trường liên quan
    if (data.type === "homepage") {
      if (data.subtitle) formData.append("subtitle", data.subtitle);
      if (data.description) formData.append("description", data.description);
      if (data.features)
        formData.append("features", JSON.stringify(data.features));
      if (data.price) formData.append("price", data.price.toString());
    }

     // Nếu loại slide là product, thêm các trường liên quan
    if (data.type === "product") {
      if (data.promotionText)
        formData.append("promotionText", data.promotionText);
      if (data.textsale) formData.append("textsale", data.textsale);
    }
    
    if (data.image instanceof FileList && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
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
      navigate("/admin/sliders");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Có lỗi sảy ra khi tạo slide!",
      });
    }
  };

  const addFeature = () => setValue("features", [...features, ""]);
  const removeFeature = (index: number) =>
    setValue(
      "features",
      features.filter((_, i) => i !== index)
    );

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

  const handleRemoveImage = (type: "image" | "backgroundImage") => {
    if (type === "image") {
      setImagePreview(null);
      setValue("image", null ); // Xóa giá trị ảnh chính
    } else if (type === "backgroundImage") {
      setBgImagePreview(null);
      setValue("backgroundImage", null ); // Xóa giá trị ảnh nền
    }
  };

  return (
    <div className="px-10 md:px-20 mx-auto p-4 sm:p-6 ">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 text-center">
        Tạo Mới Slide
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        {/* Loại Slide */}
        <div className="mb-4 sm:mb-6">
          <label
            htmlFor="type"
            className="block text-gray-700 text-base sm:text-lg"
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

        {/* Tiêu Đề */}

        {/* Các trường của Homepage */}
        {type === "homepage" && (
          <>
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="title"
                className="block text-gray-700 text-base sm:text-lg"
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
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="subtitle"
                className="block text-gray-700 text-base sm:text-lg"
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
                className="block text-gray-700 text-base sm:text-lg"
              >
                Mô Tả
              </label>
              <textarea
                id="description"
                {...register("description")}
                className="mt-2 p-2 sm:p-3 w-full border border-gray-300 rounded-lg"
                rows={4}
              />
            </div>
            <div className="mb-4 sm:mb-6">
              <label className="block text-gray-700 text-base sm:text-lg">
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
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="price"
                className="block text-gray-700 text-base sm:text-lg"
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

            <div className="flex flex-col xl:flex-row gap-10 lg:gap-20">
              {/* Ảnh Chính */}
              <div className="mb-4 sm:mb-6">
                <div className="md:flex items-center gap-5 ">
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
                    className="max-w-full md:max-w-xs overflow-hidden text-ellipsis"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-2 relative">
                    <p className="text-gray-700">Ảnh đã chọn:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="md:w-[500px] w-[250px] h-[200px] md:h-[250px] max-w-md mx-auto object-contain rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("image")}
                      className="absolute top-6 flex items-center justify-center right-0 size-5 bg-red-500 text-white p-3 rounded"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>

              {/* Ảnh Nền */}
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
                    className="max-w-full md:max-w-xs overflow-hidden text-ellipsis"
                  />
                </div>

                {bgImagePreview && (
                  <div className="mt-2 relative">
                    <p className="text-gray-700">Ảnh Nền đã chọn:</p>
                    <img
                      src={bgImagePreview}
                      alt="Background Preview"
                      className="md:w-[500px] w-[250px] h-[200px] md:h-[250px] max-w-md mx-auto object-contain rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("backgroundImage")}
                      className="absolute top-6 flex items-center justify-center right-0 size-5 bg-red-500 text-white p-3 rounded"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Các trường của Product */}
        {type === "product" && (
          <>
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="title"
                className="block text-gray-700 text-base sm:text-lg"
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
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="promotionText"
                className="block text-gray-700 text-base sm:text-lg"
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
                className="block text-gray-700 text-base sm:text-lg"
              >
                Text khuyến mãi bao nhiêu %
              </label>
              <input
                id="textsale"
                {...register("textsale")}
                className="mt-2 p-2 sm:p-3 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex flex-col xl:flex-row gap-10 md:gap-32">
              {/* Ảnh Chính */}
              <div className="mb-4 sm:mb-6">
                <div className="md:flex items-center gap-5 ">
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
                    className="max-w-full md:max-w-xs overflow-hidden text-ellipsis"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-2 relative">
                    <p className="text-gray-700">Ảnh đã chọn:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="md:w-[500px] w-[250px] h-[200px] md:h-[250px] max-w-md mx-auto object-contain rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("image")}
                      className="absolute top-6 flex items-center justify-center right-0 size-5 bg-red-500 text-white p-3 rounded"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>

              {/* Ảnh Nền */}
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
                    className="max-w-full md:max-w-xs overflow-hidden text-ellipsis"
                  />
                </div>

                {bgImagePreview && (
                  <div className="mt-2 relative">
                    <p className="text-gray-700">Ảnh Nền đã chọn:</p>
                    <img
                      src={bgImagePreview}
                      alt="Background Preview"
                      className="md:w-[500px] w-[250px] h-[200px] md:h-[250px] max-w-md mx-auto object-contain rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("backgroundImage")}
                      className="absolute top-6 flex items-center justify-center right-0 size-5 bg-red-500 text-white p-3 rounded"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className=" bg-blue-500 mt-6 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out "
        >
          {isSubmitting ? "Đang Tạo..." : "Tạo Slide"}
        </button>
      </form>
    </div>
  );
};

export default AddSlider;
