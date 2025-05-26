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
  // State để theo dõi phần tử toggle nào đang được chọn
  // const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const idColor = "675e387b5cccfd8536c5f0e3";

  const [searchParams, setSearchParams] = useSearchParams();
  const filterTypeCategory = searchParams.get("category");

  const [valuePrice, setValuePrice] = useState<number[]>([0, 10000000]);

  const { isLoading, data } = useGetCategory();
  const { isLoadingAtribute, atribute, error } =
    useGetAttributeByIDClient(idColor);

  // const handleToggle = (index: number) => {
  //   // Nếu index đã được chọn thì đặt thành null để bỏ chọn
  //   setActiveIndex(activeIndex === index ? null : index);
  // };
 if (error) return <div className="flex items-center justify-center p-[10rem] my-10   ">
        <AiOutlineExclamationCircle className="text-red-500 text-xl mr-2" />
        <span className="text-red-600 font-semibold">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</span>
      </div>;
  console.log("atribute", atribute);

  return (
    <div className="lg:w-[25%] mt-[35px] mb-10 lg:mt-0 order-0 uppercase font-raleway pr-[15px]">
      <h4 className="font-black text-[#343434] text-lg leading-6 mb-[10px]">
        danh mục
      </h4>
      {isLoading ||
        (isLoadingAtribute && (
          <div className="">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="mb-6" key={index}>
                <Skeleton className="h-6 custom-pulse mb-4" />
              </div>
            ))}
          </div>
        ))}
      <ul className="categories-menu">
        <li className="relative group !list-none">
          <span
            className={`text-[11px] text-[#888] hover:text-[#b8cd06] leading-4 border-b border-b-[#efefef] py-[15px] font-bold w-full block transition-all duration-300 cursor-pointer 
            `}
            onClick={() => {
              searchParams.set("category", "all");
              searchParams.delete("search");
              if (searchParams.get("page")) searchParams.set("page", "1");
              setSearchParams(searchParams);
            }}
          >
            Tất cả
          </span>
        </li>
        {data?.map((category: ICategory) => (
          <li className="relative group !list-none" key={category._id}>
            <span
              className={`text-[11px] text-[#888] hover:text-[#b8cd06] leading-4 border-b border-b-[#efefef] py-[15px] font-bold w-full block transition-all duration-300 cursor-pointer ${
                filterTypeCategory === category._id ? "text-[#b8cd06]" : ""
              }`}
              onClick={() => {
                searchParams.set("category", category._id);
                searchParams.delete("search");
                if (searchParams.get("page")) searchParams.set("page", "1");
                setSearchParams(searchParams);
              }}
            >
              {category.name}
            </span>
          </li>
        ))}
      </ul>
      <div className="h-[25px] md:h-[50px]"></div>
      <h4 className="font-black text-[#343434] text-lg leading-6 mb-[10px]">
        giá tiền
      </h4>
      <Slider
        className="mt-[25px]"
        onValueCommit={(value) => {
          searchParams.delete("search");
          searchParams.set("price", JSON.stringify(value));
          setSearchParams(searchParams);
        }}
        onValueChange={(value) => setValuePrice(value)}
        min={0}
        max={10000000}
        value={valuePrice}
        minStepsBetweenThumbs={1}
      />
      <p className="uppercase font-questrial text-xs font-extralight leading-[18px] mt-4">
        giá: <span>{formatCurrency(valuePrice[0])} VNĐ</span>&nbsp;&nbsp; -
        &nbsp;&nbsp;
        <span>{formatCurrency(valuePrice[1])} VNĐ</span>
      </p>

      <div className="h-[25px] md:h-[50px]"></div>
      <h4 className="font-black text-[#343434] text-lg leading-6 mb-[10px]">
        {atribute?.name}
      </h4>

      <ToggleGroup
        className="justify-start gap-2 w-full  flex-wrap lg:px-[15px]"
        type="single"
        // disabled={deleted}
      >
        {atribute?.values.map((item: IValues) => {
          return (
            <ToggleGroupItem
              onClick={() => {
                searchParams.delete("search");
                if (searchParams.get("color") === item._id) {
                  console.log("item");
                  searchParams.set("color", "all");
                  if (searchParams.get("page")) searchParams.set("page", "1");
                  setSearchParams(searchParams);
                } else {
                  searchParams.set("color", item._id);

                  if (searchParams.get("page")) searchParams.set("page", "1");
                  setSearchParams(searchParams);
                }
              }}
              key={item._id}
              className={`rounded-none border size-6 p-0 cursor-pointer transition-all ${
                searchParams.get("color") === item._id
                  ? "data-[state=on]:border-4"
                  : ""
              }`}
              value={item.value}
              style={{
                backgroundColor: item.value,
              }}
            ></ToggleGroupItem>
          );
        })}
      </ToggleGroup>
      <Button
        className="mt-4 lg:ml-4"
        onClick={() => {
          searchParams.set("color", "all");

          if (searchParams.get("page")) searchParams.set("page", "1");
          setSearchParams(searchParams);
        }}
      >
        Tất cả
      </Button>
    </div>
  );
};

export default CategoriesMenu;
