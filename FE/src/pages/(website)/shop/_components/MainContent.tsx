import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetAllProduct } from "../actions/useGetAllProduct";
import CarouselBanner from "./CarouselBanner";
import ProductItem from "./ProductItem";
import Pagination from "@/components/Pagination";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export function MainContent() {
  // Sử dụng hook để lấy và cập nhật các tham số từ URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy giá trị giới hạn sản phẩm mỗi trang (limit) từ URL hoặc mặc định là 9
  const currentFilter = searchParams.get("limit") || "9";
  const limit = parseInt(currentFilter, 10);

  // Lấy trang hiện tại từ URL hoặc mặc định là 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Lấy từ khóa tìm kiếm nếu có
  const keyProduct = searchParams.get("search") || "";

  // Gọi custom hook để fetch danh sách sản phẩm (có thể truyền filter từ URL)
  const { isLoading, listProduct, error } = useGetAllProduct();

  // Tổng số sản phẩm và chiều dài danh sách hiện tại
  const totalItems = listProduct?.pagination?.totalItems || 0;
  const currentLength = listProduct?.data?.length || 0;

  // Tính toán phạm vi sản phẩm đang hiển thị (VD: 1-9, 10-18...)
  const from = (currentPage - 1) * limit + 1;
  const to = Math.min(from + currentLength - 1, totalItems);

  // Hàm xử lý khi người dùng chọn thay đổi số sản phẩm hiển thị/trang
  function handleChange(value: string) {
    searchParams.set("limit", value);
    if (searchParams.get("page")) searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  // Tự động scroll lên đầu trang khi người dùng chuyển trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Nếu có lỗi từ API thì hiển thị thông báo lỗi thân thiện
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
    <div className="w-full lg:w-[75%] lg:order-1 lg:mb-10">
      {/* Hiển thị banner sản phẩm */}
      <CarouselBanner />

      <div className="mt-[35px]">
        <div className="flex text-nowrap flex-wrap items-center">
          {/* Tiêu đề khu vực sản phẩm */}
          <h4 className="font-black text-[#343434] text-lg leading-6 mb-[10px] mr-5 uppercase">
            {keyProduct ? `Tìm kiếm: ${keyProduct}` : "Sản phẩm mới"}
          </h4>

          {/* Hiển thị thông tin số lượng đang hiển thị */}
          <p className="inline-block uppercase text-[11px] text-[#888] mb-[10px] mr-5">
            hiển thị{" "}
            <b>
              {from}-{to}
            </b>{" "}
            của <b>{totalItems}</b> kết quả
          </p>

          {/* Bộ lọc: chọn số sản phẩm hiển thị mỗi trang */}
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

        {/* Danh sách sản phẩm */}
        <ProductItem listProduct={listProduct || []} isLoading={isLoading} />

        {/* Phân trang */}
        <Pagination totalCount={totalItems} pageSize={limit} />
      </div>
    </div>
  );
}
