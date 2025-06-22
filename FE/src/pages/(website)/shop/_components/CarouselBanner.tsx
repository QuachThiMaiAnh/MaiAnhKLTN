import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi, // Loại cho API điều khiển carousel
} from "@/components/ui/carousel"; // Import các thành phần carousel tùy chỉnh

import { useEffect, useState } from "react";
import { Slide } from "@/common/types/Slide"; // Kiểu dữ liệu slide
import axios from "axios";

const CarouselBanner = () => {
  // State lưu danh sách slide từ server
  const [slidesData, setSlidesData] = useState<Slide[]>([]);
  // State lưu API điều khiển carousel (ví dụ: chuyển slide thủ công)
  const [api, setApi] = useState<CarouselApi>();
  // State lưu slide đang hiển thị (index hiện tại)
  const [current, setCurrent] = useState(0);

  // Gọi API lấy dữ liệu slide khi component mount (Lấy slide product)
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/sliders?type=product"
        );
        setSlidesData(response.data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu slide:", error);
      }
    };

    fetchSlides();
  }, []);

  // Lắng nghe thay đổi carousel thông qua API và cập nhật chỉ số slide hiện tại
  useEffect(() => {
    if (!api) return;

    // Đặt chỉ số slide hiện tại khi khởi tạo
    setCurrent(api.selectedScrollSnap() + 1);

    // Cập nhật chỉ số khi người dùng chuyển slide
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} className="relative">
      <CarouselContent>
        {slidesData.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="rounded-lg overflow-hidden relative w-full h-full">
              {/* Hình nền sử dụng backgroundImage từ API */}
              <div
                className="bg-cover bg-center relative pb-[40%]"
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                  backgroundPosition: "top",
                }}
              ></div>

              {/* Nội dung slide (text + promotionText)
              Nội dung (text mô tả, tiêu đề, khuyến mãi) hiển thị ở bên trái hoặc phải tùy index. */}
              <div
                className={`bg-[#2c2c2c] md:bg-transparent block uppercase text-center py-5 px-[15px] pb-16 md:absolute top-12 lg:top-16 ${
                  index % 2 !== 0 ? "right-10" : "left-10"
                }`}
              >
                <span className="text-[#ffffff80] leading-6 text-sm">
                  {slide.promotionText}
                </span>
                <h4 className="text-[#b8cd06] text-3xl leading-8 mb-[10px]">
                  {slide.textsale}
                </h4>
                <h4 className="text-white text-lg font-black mb-6">
                  {slide.title}
                </h4>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Điều hướng slide dưới dạng chấm tròn */}
      {/* Khi người dùng click vào một chấm, carousel sẽ trượt đến slide tương ứng. */}
      <div className="flex items-center mt-4 absolute bottom-[5%] left-1/2 translate-x-[-50%]">
        {Array.from({ length: slidesData.length }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`rounded-full mx-1 focus:outline-none border transition-all ${
              index === current - 1
                ? "border-[#b8cd06] border-4 size-4"
                : "border-gray-300 border-2 size-3"
            }`}
          />
        ))}
      </div>
    </Carousel>
  );
};

export default CarouselBanner;
