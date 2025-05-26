import { useUserContext } from "@/common/context/UserProvider";
import React from "react";
import { Link } from "react-router-dom";
import { useGetWishList } from "./action/useGetWishList";
import useWishList from "./action/useWishList";

import { IoMdTrash } from "react-icons/io";

import { formatCurrency } from "@/lib/utils";
import { Product } from "@/common/types/Products";
type ActionType = "removeItem" | "removeItemAfterAddCart";

interface Action {
  type: ActionType;
}

interface Value {
  productId: string; 
}


const WishListPage = () => {
  React.useEffect(() => {
    document.title = "Yêu Thích";
  }, []);
  const { _id } = useUserContext();

  const { wishList, isLoading, isError } = useGetWishList(_id);

  const {
    // isLoading,
    // isError,
    removeItem,
  } = useWishList(_id);

  if (isLoading) {
    return (
      <div className="container h-screen flex items-center justify-center">
        <h1 className="text-xl text-gray-500">Đang tải...</h1>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="container h-screen flex items-center justify-center">
        <h1 className="text-xl text-red-500">Có lỗi xảy ra. Vui lòng thử lại sau!</h1>
      </div>
    );
  }
  

  function userAction(action: Action, value: Value) {
    const item = {
      userId: _id,
      ...value,
    };

    switch (action.type) {
      case "removeItem":{
        const confirm = window.confirm("Bạn chắc muốn xóa chứ?");
        if (!confirm) return;
        removeItem.mutate(item);
        break;
      }
      case "removeItemAfterAddCart":
        removeItem.mutate(item);
        break;
    }
  }

  return (
    <div className="container h-screen">
      <div className="h-[30px] md:h-[60px]"></div>

      <h1 className="uppercase font-raleway text-4xl text-center text-[#333]">
        danh mục yêu thích của bạn
      </h1>

      <div className="h-[30px] md:h-[50px]"></div>

      <div className="border-t border-black py-8">
        <div className="Mid flex flex-col gap-6">
          {(!wishList || wishList.products.length === 0) && (
            <div className="flex flex-col items-center justify-center">
              {/* <img src={cartEmpty} alt="cart-empty" className="w-1/5" /> */}
              <p className="text-[#9D9EA2] max-sm:text-[14px]">
                Danh sách trống
              </p>
            </div>
          )}
          {wishList?.products.map((item: Product) => (
            <div
              className="flex gap-5 pb-8 border-b last:border-none border-dashed"
              key={item.productItem._id}
            >
              <img
                className="w-24 h-24 object-cover"
                src={item.productItem.image}
                alt={item.productItem.name}
              />

              <div className="w-full">
                <div className="flex justify-between">
                  <Link to={`/product/${item.productItem._id}`}>
                    <h3 className="text-lg font-bold hover:text-[#b8cd06]">
                      {item.productItem.name}
                    </h3>
                  </Link>

                  <IoMdTrash
                    className="text-3xl cursor-pointer"
                    onClick={() =>
                      userAction(
                        { type: "removeItem" },
                        {
                          productId: item.productItem._id,
                        }
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between mt-2 flex-wrap">
                  <h3 className="text-lg">
                    Giá{" "}
                    {item.productItem.priceSale ? (
                      <>
                        <span className="mr-4 text-red-700">
                          {formatCurrency(item.productItem.priceSale)} VNĐ
                        </span>
                        <span className="line-through text-[#9D9EA2]">
                          {formatCurrency(item.productItem.price)} VNĐ
                        </span>
                      </>
                    ) : (
                      <span className="text-red-700">
                        {formatCurrency(item.productItem.price)} VNĐ
                      </span>
                    )}
                  </h3>

                  <p className="text-[#9D9EA2] transition-all duration-500">
                    Còn {item.productItem.countOnStock} sản phẩm
                  </p>
                </div>
              </div>
            </div>
          ))}
          {/* End Cart__Product */}
        </div>
      </div>
    </div>
  );
};

export default WishListPage;
