import { useState } from "react";
import { useGetCategory } from "../actions/useGetCategory";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";
import { useGetAttributeByIDClient } from "@/pages/(dashboard)/attribute/actions/useGetAttributeByIDClient";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { AiOutlineExclamationCircle } from "react-icons/ai";

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  __v: number;
}

interface IValues {
  value: string;
  _id: string;
  type: string;
  slugName: string;
  name: string;
}

const CategoriesMenu = () => {
  // ID thuộc tính "color" để filter
  const idColor = "675e387b5cccfd8536c5f0e3";

  // Quản lý URL params
  const [searchParams, setSearchParams] = useSearchParams();
  const filterTypeCategory = searchParams.get("category");

  // State lưu giá trị giá tiền được chọn trên slider
  const [valuePrice, setValuePrice] = useState<number[]>([0, 3000000]);

  // Gọi API lấy danh sách danh mục sản phẩm
  const { isLoading, data } = useGetCategory();

  // Gọi API lấy thông tin thuộc tính màu sắc (color)
  const { isLoadingAttribute, attribute, error } =
    useGetAttributeByIDClient(idColor);

  console.log("attribute", attribute);

  // Nếu có lỗi khi gọi API thuộc tính thì hiển thị thông báo
  if (error)
    return (
      <div className="flex items-center justify-center p-[10rem] my-10">
        <AiOutlineExclamationCircle className="text-red-500 text-xl mr-2" />
        <span className="text-red-600 font-semibold">
          Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
        </span>
      </div>
    );

  return (
    <div className="lg:w-[25%] mt-[35px] mb-10 lg:mt-0 order-0 uppercase font-raleway pr-[15px]">
      {/* Tiêu đề danh mục */}
      <h4 className="font-black text-[#343434] text-lg leading-6 mb-[10px]">
        danh mục
      </h4>

      {/* Loading skeleton khi đang tải dữ liệu */}
      {isLoading ||
        (isLoadingAttribute && (
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="mb-6" key={index}>
                <Skeleton className="h-6 custom-pulse mb-4" />
              </div>
            ))}
          </div>
        ))}

      {/* Danh sách các danh mục sản phẩm */}
      <ul className="categories-menu">
        {/* Mục "Tất cả" để reset bộ lọc danh mục */}
        <li className="relative group !list-none">
          <span
            className="text-[11px] text-[#888] hover:text-[#b8cd06] leading-4 border-b border-b-[#efefef] py-[15px] font-bold w-full block transition-all duration-300 cursor-pointer"
            onClick={() => {
              searchParams.set("category", "all"); // Reset bộ lọc danh mục về "Tất cả"
              searchParams.delete("search"); // Xóa bộ lọc tìm kiếm nếu có
              if (searchParams.get("page")) searchParams.set("page", "1"); // o	Nếu đang ở trang khác → reset về page=1.
              setSearchParams(searchParams);
            }}
          >
            Tất cả
          </span>
        </li>

        {/* Danh mục lấy từ API */}
        {data?.map((category: ICategory) => (
          <li className="relative group !list-none" key={category._id}>
            <span
              className={`text-[11px] text-[#888] hover:text-[#b8cd06] leading-4 border-b border-b-[#efefef] py-[15px] font-bold w-full block transition-all duration-300 cursor-pointer ${
                filterTypeCategory === category._id ? "text-[#b8cd06]" : ""
              }`}
              onClick={() => {
                searchParams.set("category", category._id); // Cập nhật bộ lọc danh mục theo ID danh mục
                searchParams.delete("search"); // Xóa bộ lọc tìm kiếm nếu có
                if (searchParams.get("page")) searchParams.set("page", "1"); // Nếu đang ở trang khác → reset về page=1.
                setSearchParams(searchParams);
              }}
            >
              {category.name}
            </span>
          </li>
        ))}
      </ul>

      <div className="h-[25px] md:h-[50px]"></div>

      {/* Bộ lọc theo khoảng giá */}
      <h4 className="font-black text-[#343434] text-lg leading-6 mb-[10px]">
        giá tiền
      </h4>
      <Slider
        className="mt-[25px]"
        onValueCommit={(value) => {
          searchParams.delete("search");
          searchParams.set("price", JSON.stringify(value)); // Lưu giá trị giá tiền dưới dạng chuỗi JSON
          setSearchParams(searchParams);
        }} // → cập nhật URL param price dưới dạng chuỗi JSON [min, max]
        onValueChange={(value) => setValuePrice(value)} // Cập nhật giá trị slider khi người dùng kéo
        min={0}
        max={3000000}
        value={valuePrice}
        minStepsBetweenThumbs={1}
      />
      <p className="uppercase font-questrial text-xs font-extralight leading-[18px] mt-4">
        giá: <span>{formatCurrency(valuePrice[0])} VNĐ</span>&nbsp;&nbsp; -
        &nbsp;&nbsp;<span>{formatCurrency(valuePrice[1])} VNĐ</span>
      </p>

      <div className="h-[25px] md:h-[50px]"></div>

      {/* Thuộc tính màu sắc */}
      <h4 className="font-black text-[#343434] text-lg leading-6 mb-[10px]">
        {attribute?.name}
      </h4>

      {/* Nhóm toggle các màu sắc để lọc */}
      <ToggleGroup
        className="justify-start gap-2 w-full flex-wrap lg:px-[15px]"
        type="single"
      >
        {attribute?.values.map((item: IValues) => {
          return (
            <ToggleGroupItem
              onClick={() => {
                // Xóa bộ lọc tìm kiếm nếu có
                searchParams.delete("search");
                // Nếu màu sắc đã được chọn thì bỏ chọn, ngược lại thì chọn
                if (searchParams.get("color") === item._id) {
                  searchParams.set("color", "all");
                } else {
                  searchParams.set("color", item._id);
                }
                // Nếu đang ở trang khác thì reset về trang 1
                if (searchParams.get("page")) searchParams.set("page", "1");
                setSearchParams(searchParams);
              }}
              key={item._id}
              className={`rounded-none border size-6 p-0 cursor-pointer transition-all ${
                searchParams.get("color") === item._id
                  ? "data-[state=on]:border-4"
                  : ""
              }`}
              value={item.value} // Sử dụng giá trị màu sắc làm giá trị của toggle
              style={{ backgroundColor: item.value }} // Sử dụng giá trị màu sắc làm nền
            ></ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      {/* Nút để chọn lại tất cả màu sắc */}
      <Button
        className="mt-4 lg:ml-4"
        onClick={() => {
          searchParams.set("color", "all");
          if (searchParams.get("page")) searchParams.set("page", "1");
          setSearchParams(searchParams);
        }}
      >
        Xóa bộ lọc màu sắc
      </Button>
    </div>
  );
};

export default CategoriesMenu;
