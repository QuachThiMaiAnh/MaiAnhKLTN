import { GrLinkNext } from "react-icons/gr";
import { SlHeart } from "react-icons/sl";

import noData from "@/assets/icons/noData.svg";

import { IProduct } from "@/common/types/Orders";

import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import PreviewProduct from "./PreviewProduct";
import SkeletonProduct from "./SkeletonProduct";
import { Link } from "react-router-dom";
import { useAddToWishList } from "../../wishlist/action/useAddToWishList";
import { useUserContext } from "@/common/context/UserProvider";
import { useGetWishList } from "../../wishlist/action/useGetWishList";
import { Product } from "@/common/types/Products";

type ProductItemProps = {
  data: IProduct[];
  pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
};

const ProductItem = ({
  listProduct,
  isLoading,
}: {
  listProduct: ProductItemProps;
  isLoading: boolean;
}) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { _id } = useUserContext();
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const { wishList, isError } = useGetWishList(_id);
  const { addWishList, isAdding } = useAddToWishList();

  const destrucId =
    wishList && wishList?.products?.map((item : Product) => item?.productItem?._id);

  if (listProduct?.data?.[0] == null || !listProduct?.data) {
    return (
      <div className="w-full text-center">
        <img src={noData} alt="No data" className="w-2/3 mx-auto mb-5" />
      </div>
    );
  }
  if (isLoading) {
    return <SkeletonProduct />;
  }
  if (isError) {
    return (
      <div className="text-[red] text-xl h-44 flex justify-center items-center">
        Đã có lỗi xảy ra vui lòng thử lại sau!
      </div>
    );
  }
  if (isAdding) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center text-gray-500">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-6">
        {listProduct &&
          listProduct?.data?.length > 0 &&
          listProduct?.data.map((product) => (
            // console.log("product", product),
            <div
              // className="product-item border-x border-[#f7f7f7] pt-[25px] px-[30px] pb-[5px] mb-[60px] overflow-hidden"
              className="product-item border-x border-[#f7f7f7] px-[30px] pb-[5px] mb-[60px] overflow-hidden"
              key={product._id}
            >
              {/* TITLE */}
              <div className="uppercase mb-[10px]">
                {/* Category */}
                {/* <a
              className="text-[#b8cd06] text-[11px] leading-[18px] block mb-[5px]"
              href="#"
            >
              smart phones
            </a> */}
                <a
                  className=" text-[#343434] leading-[18px] font-raleway text-[13px] block title-product transition-all duration-150 font-black"
                  href="#"
                >
                  {product.name}
                </a>
              </div>

              {/* IMAGE PRODUCT */}
              <div className="relative mb-[30px]">
                <img
                  loading="lazy"
                  className="max-w-[200px] h-[200px] mx-auto"
                  src={product.image}
                  // src={clothesNorth}
                  alt="Image Product"
                />
                <div className="preview-btn valign-middle md:!ml-[-89px] lg:!ml-[-85px] xl:!ml-[-100px]">
                  <div className="relative mx-auto uppercase">
                    <Link
                      to={`/product/${product._id}`}
                      className="btn bg-[#343434] px-[30px] pt-[17px] pb-[15px] block text-center mb-[10px] text-[11px] font-bold text-white rounded-full font-raleway lg:w-[175px]"
                    >
                      <span className="relative">
                        <GrLinkNext className="text-xl absolute block left-[-300%] icon" />

                        <span className="relative text left-0">xem thêm</span>
                      </span>
                    </Link>
                    {/* <a
                      href="#"
                      className="btn bg-[#b8cd06] px-[30px] pt-[17px] pb-[15px] block text-center mb-[10px] text-[11px] font-bold text-white rounded-full font-raleway lg:w-[175px] cart"
                    >
                      <span className="relative">
                        <IoBagHandleSharp className="text-xl absolute block left-[-300%] icon" />

                        <span className="relative text left-0">
                          thêm vào giỏ hàng
                        </span>
                      </span>
                    </a> */}
                  </div>
                </div>
              </div>

              {/* PRICE AND DESCRIPTION */}
              <div>
                <div className="flex justify-between h-9">
                  <span>
                    {product.priceSale && product.priceSale < product.price ? (
                      <>
                        <span className="text-red-700 text-xl font-bold">
                          {formatCurrency(product.priceSale)} VNĐ
                        </span>
                        &nbsp;&nbsp;&nbsp;
                        <span className="text-[#888] line-through">
                          {formatCurrency(product.price)} VNĐ
                        </span>
                      </>
                    ) : (
                      <span className="text-red-700 text-xl font-bold">
                        {formatCurrency(product.price)} VNĐ
                      </span>
                    )}
                    {/* {product.priceRange} */}
                  </span>
                  {/* &nbsp;&nbsp;&nbsp; */}
                  {/* <span className="text-[#888] line-through">1.500.000đ</span> */}
                </div>

                <div className="relative overflow-hidden h-[60px] mt-[15px]">
                  <p className="text-[13px] text-[#888] description-product line-clamp-2">
                    {product.description}
                  </p>

                  <div className="list-icon flex gap-2">
                    <span
                      className="size-8 md:size-9 border rounded-full flex items-center justify-center hover:bg-[#b8cd06] text-[#979797] hover:text-white"
                      onClick={() => {
                        setSelectedIndex(product._id);
                        setIsOpenModal(!isOpenModal);
                      }}
                    >
                      <IoEyeOutline className="cursor-pointer text-lg text-current" />
                    </span>
                    <span
                      onClick={() =>
                        addWishList({
                          userId: _id,
                          productId: product._id,
                          variantId: product.variants[0]._id as string,
                          quantity:
                            product.variants[0].countOnStock > 0 ? 1 : 0,
                        })
                      }
                      className={`size-8 md:size-9 border rounded-full flex items-center justify-center hover:bg-[#b8cd06] text-[#979797] hover:text-white ${
                        destrucId?.includes(product._id)
                          ? "bg-[#b8cd06] text-white"
                          : ""
                      }`}
                    >
                      <SlHeart
                        className={`cursor-pointer text-lg text-current hover:bg-[#b8cd06] text-[#979797] hover:text-white `}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* wishList.products */}
      {/* {listProduct?.data.length === 0 && (
        <div className="w-full text-center">
          <img src={noData} alt="No data" className="w-2/3 mx-auto mb-5" />
        </div>
      )} */}

      {/* PORTAL */}
      <PreviewProduct
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        selectedIndex={selectedIndex}
      />
    </>
  );
};

export default ProductItem;
