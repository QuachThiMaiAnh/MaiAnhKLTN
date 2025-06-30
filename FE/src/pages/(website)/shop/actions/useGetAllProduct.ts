import { useQuery } from "@tanstack/react-query";
import { getAllProduct } from "./api";
import { useSearchParams } from "react-router-dom";

export function useGetAllProduct() {
  const [searchParams] = useSearchParams();

  // Filter
  const filterValueCategory = searchParams.get("category");
  const filterValueColor = searchParams.get("color");
  const filterValuePriceJson = searchParams.get("price");
  const filterValuePrice = filterValuePriceJson
    ? JSON.parse(filterValuePriceJson)
    : null;
  const valueLimit = searchParams.get("limit");
  const valueSearch = searchParams.get("search");

  const filterCategory =
    !filterValueCategory || filterValueCategory === "all"
      ? ""
      : filterValueCategory;

  const filterColor =
    !filterValueColor || filterValueColor === "all" ? "" : filterValueColor;

  const filterPrice =
    !filterValuePrice || filterValuePrice === "" ? "" : filterValuePrice;

  const searchProduct = !valueSearch || valueSearch === "" ? "" : valueSearch;

  // Pagination
  const page = searchParams.get("page") ? +searchParams.get("page")! : 1;
  const limit = valueLimit ? +valueLimit : 9;

  const {
    isLoading,
    data: listProduct,
    error,
  } = useQuery({
    queryKey: [
      "Products",
      page,
      limit,
      filterCategory,
      filterPrice,
      filterColor,
      searchProduct,
    ],
    queryFn: () =>
      getAllProduct({
        page,
        limit,
        category: filterCategory,
        // ✅ fix truyền đúng định dạng "min,max"
        price: filterPrice ? filterPrice.join(",") : "",
        search: valueSearch || "",
        color: filterColor || "",
      }),
  });

  return { isLoading, listProduct, error };
}

/**
 * http://localhost:8080/api/products?_page=1&_limit=9&_category=675e9f7a0f4700f2ef23ecd7&_price=0,3000000&_search=&_color=
 * {,…}
data
: 
[{_id: "6762e7076b62be7e96f8f65b", name: "Áo Khoác Bò LV Thêu Đính Đá Màu bụi From rộng nam Nữ",…},…]
pagination
: 
{currentPage: 1, totalPages: 1, totalItems: 6}
 */
