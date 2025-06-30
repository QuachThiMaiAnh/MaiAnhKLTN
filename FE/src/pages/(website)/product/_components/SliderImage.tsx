import React, { useEffect, useState } from "react";
import {
  Carousel, //Là thành phần chính của carousel (băng chuyền), dùng để bao bọc các slide.
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Variant } from "@/common/types/Orders";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ProductCarouselProps {
  imageMain: string;
  variants: Variant[];
}

const SliderImage: React.FC<ProductCarouselProps> = ({
  imageMain,
  variants,
}) => {
  const [apiImage, setApiImage] = useState<CarouselApi>(); // Carousel API để điều khiển ảnh- Lưu lại instance của carousel để điều khiển chọn ảnh chính từ thumbnail
  const [current, setCurrent] = useState(0); //Lưu index ảnh hiện tại đang hiển thị
  const [zoomImageIndex, setZoomImageIndex] = useState<number | null>(null); //Lưu index ảnh đang zoom trong modal (null là không zoom)
  const [isDeepZoom, setIsDeepZoom] = useState(false); //Xác định ảnh trong modal đang ở trạng thái zoom sâu hay không
  const [zoomOrigin, setZoomOrigin] = useState({ x: "50%", y: "50%" }); //Tọa độ điểm click làm gốc để transform-origin cho zoom sâu

  const images = [
    imageMain,
    ...variants
      .filter((variant) => variant.image?.trim() !== "")
      .map((v) => v.image),
  ];

  useEffect(() => {
    if (!apiImage) return;

    setCurrent(apiImage.selectedScrollSnap() + 1);
    apiImage.on("select", () => {
      setCurrent(apiImage.selectedScrollSnap() + 1);
    });
  }, [apiImage]);

  const handleZoomToggle = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (!isDeepZoom) {
      const rect = (e.target as HTMLImageElement).getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomOrigin({ x: `${x}%`, y: `${y}%` });
      setIsDeepZoom(true);
    } else {
      setIsDeepZoom(false);
    }
  };

  const handleZoomClose = () => {
    setZoomImageIndex(null);
    setIsDeepZoom(false);
  };

  const handlePrev = () => {
    if (zoomImageIndex !== null)
      setZoomImageIndex((prev) => (prev! - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (zoomImageIndex !== null)
      setZoomImageIndex((prev) => (prev! + 1) % images.length);
  };

  return (
    <div className="flex gap-8 items-start">
      {/* ==== THUMBNAIL ==== */}
      <div className="flex flex-col gap-2 h-96 overflow-y-auto pr-1 scroll-smooth">
        {images.map((img, index) => (
          <div
            key={index}
            className={`rounded-md overflow-hidden border cursor-pointer transition-all ${
              index + 1 === current
                ? "border-1 border-primary shadow-lg"
                : "border border-gray-300"
            }`}
            onClick={() => apiImage?.scrollTo(index)}
            aria-label={`Xem ảnh ${index + 1}`}
            style={{
              opacity: index + 1 === current ? 1 : 0.5,
              filter: index + 1 === current ? "none" : "grayscale(50%)",
            }}
          >
            <img
              className="w-16 h-16 object-cover"
              src={img}
              alt={`Ảnh phụ ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* ==== ẢNH CHÍNH ==== */}
      <div className="w-full max-w-sm md:max-w-md">
        <Carousel className="w-full" setApi={setApiImage}>
          <CarouselContent>
            {images.map((img, index) => (
              <CarouselItem key={index}>
                <img
                  className="w-full rounded-md cursor-zoom-in object-cover aspect-square"
                  src={img}
                  alt={`Ảnh sản phẩm ${index + 1}`}
                  loading="lazy"
                  onClick={() => {
                    setZoomImageIndex(index);
                    setIsDeepZoom(false);
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* ==== ZOOM MODAL ==== */}
      {zoomImageIndex !== null && (
        <dialog
          open
          className="fixed inset-0 p-4 z-50 bg-background2 rounded-lg flex items-center justify-center backdrop-blur-xl"
        >
          <div
            className="relative max-w-5xl w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng */}
            <button
              onClick={handleZoomClose}
              className="absolute top-4 right-4 bg-destructive hover:opacity-80 transition-all duration-200 rounded-full shadow p-2 z-10 cusor-pointer "
              aria-label="Đóng zoom"
            >
              <X />
            </button>

            {/* Nút chuyển ảnh */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-1 z-10"
              onClick={handlePrev}
              aria-label="Ảnh trước"
            >
              <ChevronLeft />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-1 z-10"
              onClick={handleNext}
              aria-label="Ảnh kế tiếp"
            >
              <ChevronRight />
            </button>

            {/* Ảnh zoom */}
            <img
              src={images[zoomImageIndex]}
              alt="Zoom ảnh sản phẩm"
              className={`max-h-[90vh] mx-auto w-auto max-w-full rounded-lg shadow-xl object-contain cursor-zoom-in transition-transform duration-300 ${
                isDeepZoom ? "scale-[2.5]" : "scale-100"
              }`}
              onClick={handleZoomToggle}
              style={{
                transformOrigin: `${zoomOrigin.x} ${zoomOrigin.y}`,
              }}
            />
          </div>
        </dialog>
      )}
    </div>
  );
};

export default SliderImage;
