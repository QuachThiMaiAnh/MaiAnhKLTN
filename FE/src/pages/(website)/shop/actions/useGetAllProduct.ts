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

  // Sort

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
        price: filterPrice,
        search: valueSearch || "",
        color: filterColor || "",
      }),
  });

  return { isLoading, listProduct, error };
}
