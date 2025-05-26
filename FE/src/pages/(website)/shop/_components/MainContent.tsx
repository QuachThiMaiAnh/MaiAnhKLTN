import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSearchParams } from "react-router-dom";
import { useGetAllProduct } from "../actions/useGetAllProduct";
import CarouselBanner from "./CarouselBanner";
import ProductItem from "./ProductItem";
import Pagination from "@/components/Pagination";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export function MainContent() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentFilter = searchParams.get("limit") || "9";
  const page = searchParams.get("page") || "1";
  const keyProduct = searchParams.get("search") || "";

  function handleChange(value: string) {
    searchParams.set("limit", value);

    if (searchParams.get("page")) searchParams.set("page", "1");

    setSearchParams(searchParams);
  }

  const { isLoading, listProduct, error } = useGetAllProduct();

  if (error) return <div className="flex items-center justify-center p-[10rem] my-10   ">
        <AiOutlineExclamationCircle className="text-red-500 text-xl mr-2" />
        <span className="text-red-600 font-semibold">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</span>
      </div>;

  return (
    <div className="w-full lg:w-[75%] lg:order-1 lg:mb-10">
      <CarouselBanner />

      {/* LAYOUT */}
      <div className="mt-[35px]">
        <div className="flex text-nowrap flex-wrap items-center">
          <h4 className="font-black text-[#343434] text-lg leading-6 mb-[10px] mr-5 uppercase">
            {keyProduct ? `Tìm kiếm: ${keyProduct}` : "Sản phẩm mới"}
          </h4>
          <p className="inline-block uppercase text-[11px] text-[#888] mb-[10px] mr-5">
            hiển thị <b>{+currentFilter * +page}</b> của{" "}
            <b>{listProduct?.pagination?.totalItems}</b> kết quả
          </p>

          {/*  */}
          <div className="mt-0 mb-2 w-32">
            <Select onValueChange={handleChange} defaultValue={currentFilter}>
              <SelectTrigger className="focus:border-[#b8cd06] rounded-2xl outline-0 ring-0 focus:outline-0 focus:ring-0 focus:ring-offset-0 md:w-[120px] mt-0">
                <SelectValue placeholder="HIỂN THỊ 9" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* PRODUCT */}
        <ProductItem listProduct={listProduct || []} isLoading={isLoading} />

        {/* PAGINATION */}
        <Pagination
          totalCount={listProduct?.pagination?.totalItems}
          // totalCount={100}
          pageSize={+currentFilter}
        />

        {/* PRODUCT */}
      </div>
    </div>
  );
}
