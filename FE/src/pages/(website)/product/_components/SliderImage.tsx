import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Variant } from "@/common/types/Orders";

interface ProductCarouselProps {
  imageMain: string;
  variants: Variant[];
}

const SliderImage: React.FC<ProductCarouselProps> = ({
  imageMain,
  variants,
}) => {
  const [apiImage, setApiImage] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const images = [
    imageMain,
    ...variants.filter((variant) => {
      return variant.image !== "";
    }),
  ];

  useEffect(() => {
    if (!apiImage) {
      return;
    }

    setCurrent(apiImage.selectedScrollSnap() + 1);

    apiImage.on("select", () => {
      setCurrent(apiImage.selectedScrollSnap() + 1);
    });
  }, [apiImage]);

  return (
    <div>
      {/* Main Carousel */}
      <Carousel className="w-full max-w-xs" setApi={setApiImage}>
        <CarouselContent>
          {images.map((variant: string | Variant, index: number) => (
            <CarouselItem key={index}>
              <img
                className="w-full"
                src={typeof variant === "string" ? variant : variant.image}
                alt="Anh san pham"
                loading="lazy"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Thumbnails */}
      <div className="flex items-center mt-12 gap-2">
        {images.map((variant: string | Variant, index: number) => (
          <div
            key={index}
            className={`${
              index + 1 === current ? "border-[#b8cd06] border-4" : ""
            } transition-all`}
          >
            <img
              className="size-14"
              src={typeof variant === "string" ? variant : variant.image}
              alt="Ảnh sản phẩm"
              onClick={() => apiImage?.scrollTo(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderImage;
