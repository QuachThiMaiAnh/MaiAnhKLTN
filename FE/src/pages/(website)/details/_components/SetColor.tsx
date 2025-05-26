import React from "react";
import { cartProductType, selectImageType } from "../page";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CarouselApi } from "@/components/ui/carousel";

interface SetColorProps {
  images: selectImageType[];
  cartProduct: cartProductType;
  handleSeclectColor: (color: selectImageType) => void;
  api: CarouselApi;
}

const SetColor: React.FC<SetColorProps> = ({
  images,
  cartProduct,
  handleSeclectColor,
  api,
}) => {
  console.log("setColor:", cartProduct);

  const click = (value: string) => {
    console.log("click:", value);
  };

  return (
    <ToggleGroup
      className="justify-start gap-4 mt-2"
      type="single"
      variant="default"
      defaultValue="#fff"
      value={cartProduct.selectImg.colorCode}
      onValueChange={(value) => click(value)}
    >
      {images.map((image, index) => (
        <ToggleGroupItem
          key={image.color}
          className="rounded-full border border-slate-200 w-8 h-8 p-1"
          value={image.colorCode}
          onClick={() => {
            api?.scrollTo(index);
            handleSeclectColor(image);
          }}
        >
          <span
            className="p-3 block rounded-full"
            style={{ backgroundColor: image.colorCode }}
          ></span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default SetColor;
