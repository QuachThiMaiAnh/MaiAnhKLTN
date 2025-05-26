import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { IoBagHandleSharp, IoClose } from "react-icons/io5";
import { SlHeart } from "react-icons/sl";
import { TiStarFullOutline } from "react-icons/ti";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { IProduct } from "@/common/types/Orders";
import {
  extractAttributes,
  filterAndFormatAttributes,
  formatCurrency,
} from "@/lib/utils";
import { useUserContext } from "@/common/context/UserProvider";

import { useAddToCart } from "../actions/useAddToCart";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { useAddToWishList } from "../../wishlist/action/useAddToWishList";
import { useGetWishList } from "../../wishlist/action/useGetWishList";
import { CommentProducts, Product } from "@/common/types/Products";

const PreviewProduct = ({
  isOpen,
  onClose,
  selectedIndex,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedIndex: string | null;
}) => {
  const { _id } = useUserContext();
  const [apiImage, setApiImage] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [productPopup, setProductPopup] = useState<IProduct>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { addCart, isAdding } = useAddToCart();
  const { addWishList } = useAddToWishList();

  const { wishList } = useGetWishList(_id);

  const [attributesChoose, setAttributesChoose] = useState<
    Record<string, string[][]>
  >({});

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (!selectedIndex || productPopup?._id === selectedIndex) return;

    setSelectedAttributes({});

    const fetchProduct = async () => {
      setIsLoading(true);
      setAttributesChoose({});
      const response = await fetch(
        `http://localhost:8080/api/products/${selectedIndex}`
      );
      const data = await response.json();
      setIsLoading(false);
      setProductPopup(data);
    };

    fetchProduct();
  }, [selectedIndex, productPopup?._id]);

  useEffect(() => {
    if (!apiImage) {
      return;
    }

    setCurrent(apiImage.selectedScrollSnap() + 1);

    apiImage.on("select", () => {
      setCurrent(apiImage.selectedScrollSnap() + 1);
    });
  }, [apiImage]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (isLoading) {
    return null;
  }

  const attributesProduct =
    !isLoading &&
    Object.entries(extractAttributes(productPopup?.variants || []));

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

    if (!productPopup) return;
    const attributeSelected = filterAndFormatAttributes(
      productPopup,
      type,
      value
    );

    setAttributesChoose((prev) => {
      const newSelected = { ...prev };

      // Duyệt qua các key trong attributeSelected
      Object.keys(attributeSelected).forEach((key) => {
        const newValue = attributeSelected[key]; // Giá trị mới từ attributeSelected

        // Kiểm tra nếu key đã tồn tại trong state (newSelected)
        if (newSelected[key]) {
          // Kiểm tra nếu value trong attributeSelected trùng với value hiện tại trong state
          if (
            newValue.length === newSelected[key][0].length &&
            newValue.every(
              (value, index) => value === newSelected[key][0][index]
            )
          ) {
            // Nếu trùng cả key và value, xóa key và value
            delete newSelected[key];
          } else {
            // Nếu chỉ trùng key, nhưng value khác, ghi đè giá trị mới cho key đó
            newSelected[key] = [newValue]; // Giá trị được thay thế
          }
        } else {
          // Nếu key chưa tồn tại, thêm mới vào state
          newSelected[key] = [newValue];
        }
      });

      return newSelected;
    });
  };

  const variantChoose =
    Object.entries(selectedAttributes).length ===
    productPopup?.variants[0].values.length
      ? productPopup?.variants.find((variant) =>
          variant.values.every((values) =>
            Object.entries(selectedAttributes).some(([key, value]) => {
              return key === values.type && values._id === value;
            })
          )
        )
      : null;

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
      productId: productPopup?._id,
      variantId: variantChoose._id,
      quantity: quantity,
      userId: _id,
    };

    addCart(data);
  };

  const countStock = variantChoose
    ? variantChoose.countOnStock
    : productPopup?.countOnStock;

  // console.log("selectedAttributes", selectedAttributes);

  const images = [
    productPopup?.image,
    ...(productPopup?.variants
      ? productPopup.variants.filter((v) => {
          return v.image != "";
        })
      : []),
  ];

  console.log("productPopup", productPopup);
  const activeData = productPopup?.comments?.filter((item:CommentProducts) => !item.deleted) ?? []; // Lọc ra các item chưa bị xóa
  const totalRating = activeData?.length ? activeData.reduce((sum: number, item: CommentProducts) => sum + item.rating, 0) : 0; // Tính tổng rating
  const averageRating = productPopup && totalRating / activeData.length; // Tính trung bình rating

  const targetId = "675dadfde9a2c0d93f9ba531";

  const exists = productPopup?.category.find(
    (category) => category._id == targetId
  )
    ? true
    : false;

  const categories =
  productPopup?.category && productPopup?.category.length >= 2 && exists
      ? productPopup?.category.filter((category) => category._id !== targetId)
      : productPopup?.category;

  // console.log(productPopup?.variants);

  return createPortal(
    <div
      className={`fixed inset-0 bg-[#000c] z-50 backdrop-blur-sm transition-opacity duration-500 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } flex items-center justify-center`}
      onClick={onClose}
    >
      <div
        className={`absolute max-w-[1170px] top-0 left-0 right-0 bottom-0 overflow-auto bg-white p-4 rounded shadow-lg transform transition-transform duration-500 m-5 xl:mx-auto ${
          isOpen ? "scale-100 opacity-100" : "scale-120 opacity-0 p-[15px]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-co1 md:grid-cols-2 py-10 px-[15px] lg:py-20 lg:px-[100px] overflow-hidden">
          <div className="px-[15px] mx-auto mb-[30px] md:mb-0">
            <Carousel className="w-full max-w-xs" setApi={setApiImage}>
              <CarouselContent>
                {images?.map((img, index: number) => (
                  <CarouselItem key={index}>
                    <img
                      className="w-full"
                      src={typeof img === "string" ? img : img?.image}
                      alt="Anh san pham"
                      loading="lazy"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="flex items-center mt-4 gap-2">
              {images.map((img, index: number) => (
                <div
                  key={index}
                  className={`${
                    index + 1 === current ? "border-[#b8cd06] border-4" : ""
                  } transition-all`}
                >
                  <img
                    key={index}
                    className={`size-14 `}
                    src={typeof img === "string" ? img : img?.image}
                    alt="Ảnh sản phẩm"
                    onClick={() => apiImage?.scrollTo(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 */}
          <div className="px-[15px]">
            {/* Category */}
            <div className="uppercase text-[#555] text-sm leading-5 flex gap-4 mb-2">
              {productPopup && categories &&
                categories.map((category) => (
                  <Link
                    key={category._id}
                    onClick={onClose}
                    to={`/shopping?category=${category._id}`}
                    className=" hover:text-blue-900 hover:underline"
                  >
                    {category.name}
                  </Link>
                ))}
            </div>
            <h2 className="text-3xl leading-8 uppercase font-black font-raleway text-[#343434] mb-[25px]">
              {productPopup?.name}
            </h2>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center md:mb-[25px]">
              <span className="uppercase text-lg text-[#555]">
                giá:{" "}
                <span className="text-red-700 font-semibold text-sm">
                  {variantChoose ? (
                  variantChoose.priceSale !== undefined && variantChoose.priceSale > 0 && variantChoose.priceSale < variantChoose.price ? (
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
                  ) : productPopup?.priceSale &&  productPopup?.priceSale > 0 && productPopup.priceSale < productPopup.price ? (
                    <>
                      <span className="text-xl">
                        {formatCurrency(productPopup?.priceSale)} VNĐ
                      </span>
                      <span className="line-through ml-3 text-[#bcbcbc]">
                        {formatCurrency(productPopup?.price)} VNĐ
                      </span>
                    </>
                  ) : (
                    <span className="text-xl">
                      {formatCurrency(productPopup?.price ?? 0)} VNĐ
                    </span>
                  )}
                </span>
              </span>

              {/* Star Rating */}
              <div className="flex gap-0.5 mb-[25px] md:mb-0">
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
                  {(productPopup && productPopup.comments.length) || 0} Đánh giá
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#888] leading-[22px] mb-[30px]">
              {productPopup?.description}
            </p>

            {/* Attribute */}
            {attributesProduct &&
              attributesProduct.map(([key, value]) => (
                <div
                  className="mb-10 flex flex-col md:flex-row md:items-center"
                  key={key}
                >
                  <span className="uppercase text-[13px] text-[#343434] font-raleway font-black mb-2 w-full md:w-4/12">
                    {key}:
                  </span>

                  <ToggleGroup
                    className="justify-start gap-2 w-full md:w-8/12 flex-wrap px-[15px]"
                    type="single"
                    disabled={productPopup?.deleted}
                  >
                    {(value as string[]).map((item: string, idx: number) => {
                      if (item.split(":")[1].startsWith("#")) {
                        return (
                          <ToggleGroupItem
                            onClick={() =>
                              handleAttributeSelect(key, item.split(":")[0])
                            }
                            key={`${item.split(":")[0]}-${idx}`}
                            className={`rounded-none border data-[state=on]:border-2 size-6 p-0 cusor-pointer transition-all`}
                            value={item.split(":")[0]}
                            style={{
                              backgroundColor: item.split(":")[1],
                            }}
                            disabled={
                              key in attributesChoose
                                ? !attributesChoose[key][0].includes(
                                    item.split(":")[0]
                                  )
                                : false
                            }
                          ></ToggleGroupItem>
                        );
                      } else {
                        return (
                          <ToggleGroupItem
                            onClick={() =>
                              handleAttributeSelect(key, item.split(":")[0])
                            }
                            className="rounded-none border data-[state=on]:border-2 data-[state=on]:text-black transition-all uppercase px-3 h-8"
                            value={item.split(":")[0]}
                            key={item.split(":")[0]}
                            disabled={
                              key in attributesChoose
                                ? !attributesChoose[key][0].includes(
                                    item.split(":")[0]
                                  )
                                : false
                            }
                          >
                            {item.split(":")[1]}
                          </ToggleGroupItem>
                        );
                      }
                    })}
                  </ToggleGroup>
                </div>
              ))}

            {/* Quantity */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center">
              <span className="uppercase text-[13px] text-[#343434] font-raleway font-black mb-2 w-full md:w-4/12">
                số lượng:
              </span>

              <div className="flex flex-col xl:flex-row md:items-start xl:items-center xl:h-[42px] ">
                <div className="flex items-center h-[42px]">
                  <button
                    className={`cursor-pointer flex justify-center items-center text-5xl font-light w-[50px] h-full text-center border border-r-0 rounded-tl-full rounded-bl-full text-[#333] outline-0 ${
                      productPopup?.deleted
                        ? "bg-gray-100 opacity-35 pointer-events-none"
                        : ""
                    }`}
                    onClick={() => {
                      if (quantity > 1) setQuantity(quantity - 1);
                    }}
                  >
                    -
                  </button>
                  <input
                    className={`border py-2 text-center outline-0 max-w-24 ${
                      productPopup?.deleted
                        ? "bg-gray-100 opacity-35 pointer-events-none"
                        : ""
                    }`}
                    onChange={(e) => {
                      const input = e.target.value;

                      if (/^\d+$/.test(input) && Number(input) > 0) {
                        setQuantity(+e.target.value);
                      }
                    }}
                    value={productPopup?.deleted ? 0 : quantity}
                  />
                  <button
                    className={`cursor-pointer flex justify-center items-center text-3xl font-light w-[50px] h-full text-center border border-l-0 rounded-tr-full rounded-br-full text-[#333] ${
                      productPopup?.deleted
                        ? "bg-gray-100 opacity-35 pointer-events-none"
                        : ""
                    }`}
                    onClick={() => {
                      setQuantity(+quantity + 1);
                    }}
                  >
                    +
                  </button>
                </div>

                {productPopup?.deleted ? (
                  <span className="ml-4 text-xl text-red-700 font-bold mt-3 xl:mt-0 md:mb-4 xl:mb-0">
                    Sản phẩm ngừng bán
                  </span>
                ) : (
                  <span className="ml-4 text-xs">
                    {countStock} sản phẩm có sẵn
                  </span>
                )}
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex flex-col md:flex-row gap-2 text-[11px] font-raleway font-bold">
              <button
                className={`btn-add text-white uppercase flex-1 ${
                  isAdding ? "cursor-not-allowed" : ""
                } ${
                  productPopup?.deleted ? "opacity-30 pointer-events-none" : ""
                }`}
                onClick={handleAddToCart}
                disabled={isAdding}
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
                  productPopup?.deleted ? "opacity-30 pointer-events-none" : ""
                }`}
                onClick={() =>
                  addWishList({
                    userId: _id,
                    productId: productPopup?._id,
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
                          (product: Product) =>
                            product.productItem._id === productPopup?._id
                        )
                          ? "text-red-700"
                          : ""
                      }`}
                    />
                  </span>
                  <span
                    className={`text ${
                      wishList?.products.some(
                        (product:Product) =>
                          product.productItem._id === productPopup?._id
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
        </div>

        <IoClose
          className="absolute top-4 right-4 text-4xl cursor-pointer"
          onClick={onClose}
        />
      </div>
    </div>,
    document.body
  );
};

export default PreviewProduct;
