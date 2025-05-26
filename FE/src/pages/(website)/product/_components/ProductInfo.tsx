import { IProduct } from "@/common/types/Orders";
import {
  extractAttributes,
  filterAndFormatAttributes,
  formatCurrency,
} from "@/lib/utils";
import React, { useState } from "react";
import { TiStarFullOutline } from "react-icons/ti";
import ButtonQuantity from "./ButtonQuantity";

import Attributes from "./Attributes";
import { IoBagHandleSharp } from "react-icons/io5";
import { SlHeart } from "react-icons/sl";
import { useAddToCart } from "../../shop/actions/useAddToCart";
import { useUserContext } from "@/common/context/UserProvider";
import { toast } from "@/components/ui/use-toast";
import { Link, useParams } from "react-router-dom";
import { useGetWishList } from "../../wishlist/action/useGetWishList";
import { useAddToWishList } from "../../wishlist/action/useAddToWishList";
import { Product } from "@/common/types/Products";
import { AiOutlineExclamationCircle } from "react-icons/ai";

interface ProductInfoProps {
  product: IProduct;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { addCart, isAdding } = useAddToCart();
  const { _id } = useUserContext();
  const { wishList, isError } = useGetWishList(_id);
  const { id } = useParams();
  const { addWishList } = useAddToWishList();

  const [attributesChoose, setAttributesChoose] = useState<
    Record<string, string[][]>
  >({});
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  const [quantity, setQuantity] = useState(1);

  const attributesProduct = Object.entries(
    extractAttributes(product.variants || [])
  ) as [string, string[]][];

  const handleAttributeSelect = (type: string, value: string) => {
    setSelectedAttributes((prev) => {
      const newSelected = { ...prev };

      if (type in newSelected) {
        if (newSelected[type] === value) {
          delete newSelected[type];
        } else {
          newSelected[type] = value;
        }
      } else {
        newSelected[type] = value;
      }

      return newSelected;
    });

    const attributeSelected = filterAndFormatAttributes(product, type, value);

    setAttributesChoose((prev) => {
      const newSelected = { ...prev };

      Object.keys(attributeSelected).forEach((key) => {
        const newValue = attributeSelected[key];

        if (newSelected[key]) {
          if (
            newValue.length === newSelected[key][0].length &&
            newValue.every(
              (value, index) => value === newSelected[key][0][index]
            )
          ) {
            delete newSelected[key];
          } else {
            newSelected[key] = [newValue];
          }
        } else {
          newSelected[key] = [newValue];
        }
      });

      return newSelected;
    });
  };

  const variantChoose =
    Object.entries(selectedAttributes).length ===
    product?.variants[0].values.length
      ? product?.variants.find((variant) =>
          variant.values.every((values) =>
            Object.entries(selectedAttributes).some(([key, value]) => {
              return key === values.type && values._id === value;
            })
          )
        )
      : null;

  const countStock = variantChoose
    ? variantChoose.countOnStock
    : product.countOnStock;

  const handleAddToCart = async () => {
    if (!variantChoose) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn thuộc tính sản phẩm",
      });
      return;
    }

    if (quantity < 0) {
      toast({
        variant: "destructive",
        title: "Số lượng không hợp lệ",
      });
      return;
    }
    const data = {
      productId: product?._id,
      variantId: variantChoose._id,
      quantity: +quantity,
      userId: _id,
    };

    addCart(data);
  };

  const activeData = product.comments.filter((item) => !item.deleted); // Lọc ra các item chưa bị xóa
  const totalRating = activeData.reduce((sum, item) => sum + item.rating, 0); // Tính tổng rating
  const averageRating = totalRating / activeData.length; // Tính trung bình rating

  const targetId = "675dadfde9a2c0d93f9ba531";

  const exists = product?.category.find((category) => category._id == targetId)
    ? true
    : false;

  const categories =
    product?.category.length >= 2 && exists
      ? product?.category.filter((category) => category._id !== targetId)
      : product?.category;
   if (isError) return (
        <div className="flex items-center justify-center p-[10rem] my-10   ">
            <AiOutlineExclamationCircle className="text-red-500 text-xl mr-2" />
            <span className="text-red-600 font-semibold">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</span>
        </div>
    );
  return (
    <div>
      <div className="uppercase text-[#555] text-sm leading-5 flex gap-4 mb-2">
        {product &&
          categories.map((category) => (
            <Link
              to={`/shopping?category=${category._id}`}
              className=" hover:text-blue-900 hover:underline"
              key={category._id}
            >
              {category.name}
            </Link>
          ))}
      </div>

      <h2 className="text-3xl leading-8 uppercase font-black font-raleway text-[#343434] mb-[25px]">
        {product.name}
      </h2>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center md:mb-[25px] overflow-hidden">
        <span className="uppercase text-lg text-[#555]">
          giá:{" "}
          <span className="text-red-700 font-semibold text-sm">
            {variantChoose ? (
            variantChoose.priceSale !== undefined &&  variantChoose.priceSale > 0 && variantChoose.priceSale < variantChoose.price ? (
                <>
                  <span className=" text-xl">
                    {formatCurrency(variantChoose.priceSale ?? 0)} VNĐ
                  </span>
                  <span className="line-through ml-3 text-[#bcbcbc]">
                    {formatCurrency(variantChoose.price)} VNĐ
                  </span>
                </>
              ) : (
                <span className="text-xl">
                  {formatCurrency(variantChoose.price)} VNĐ
                </span>
              )
            ) : product.priceSale > 0 && product.priceSale < product.price ? (
              <>
                <span className="text-xl">
                  {formatCurrency(product.priceSale)} VNĐ
                </span>
                <span className="line-through ml-3 text-[#bcbcbc]">
                  {formatCurrency(product.price)} VNĐ
                </span>
              </>
            ) : (
              <span className="text-xl">
                {formatCurrency(product.price)} VNĐ
              </span>
            )}
          </span>
        </span>

        {/* Star Rating */}
        <div className="flex gap-0.5 pl-1 mb-[25px] md:mb-0">
          {[...Array(5)].map((_, index) => (
            <TiStarFullOutline
              key={index}
              className={`text-[#b8cd06] ${
                averageRating && index < Math.floor(averageRating)
                  ? "text-[#b8cd06]"
                  : "text-[#ccc]"
              }`}
            />
          ))}
          <span className="text-[13px] text-[#888] leading-5">
            {product.comments.length || 0} Đánh giá
          </span>
        </div>
      </div>

      {/* Số lượng đc bán */}
      <span className="mb-[25px] block">Số lượng đã bán: {product.count}</span>

      {/* Description */}
      <p className="text-sm text-[#888] leading-[22px] mb-[30px]">
        {product.description}
      </p>

      {/* Attributes */}
      <Attributes
        attributes={attributesProduct}
        attributesChoose={attributesChoose}
        onAttributeSelect={handleAttributeSelect}
        deleted={product.deleted}
      />

      {/* Quantity  */}
      {/* Thieu add to cart */}
      <ButtonQuantity
        quantity={quantity}
        setQuantity={setQuantity}
        countOnStock={countStock}
        deleted={product.deleted}
      />

      <div className="flex flex-col md:flex-row gap-2 text-[11px] font-raleway font-bold overflow-hidden">
        <button
          className={`btn-add text-white uppercase flex-1 ${
            isAdding ? "cursor-not-allowed" : ""
          } ${product.deleted ? "opacity-30 pointer-events-none" : ""}`}
          onClick={handleAddToCart}
        >
          <span className="btn-add__wrapper text-[11px] px-[30px] rounded-full bg-[#343434] pt-[17px] pb-[15px] font-raleway">
            <span className="icon">
              <IoBagHandleSharp />
            </span>
            <span className="text">thêm giỏ hàng</span>
          </span>
        </button>

        <button
          className={`btn-add text-white uppercase flex-1 ${
            product.deleted ? "opacity-30 pointer-events-none" : ""
          }`}
          onClick={() =>
            addWishList({
              userId: _id,
              productId: product._id,
              variantId: "",
              quantity: 0,
            })
          }
        >
          <span className="btn-add__wrapper text-[11px] px-[30px] border rounded-full text-[#343434] pt-[17px] pb-[15px] font-raleway">
            <span className="icon">
              <SlHeart
                className={`text ${
                  wishList?.products.some(
                    (product: Product) => product.productItem._id === id
                  )
                    ? "text-red-700"
                    : ""
                }`}
              />
            </span>
            <span
              className={`text ${
                wishList?.products.some(
                  (product: Product) => product.productItem._id === id
                )
                  ? "text-red-700"
                  : ""
              }`}
            >
              thêm yêu thích
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
