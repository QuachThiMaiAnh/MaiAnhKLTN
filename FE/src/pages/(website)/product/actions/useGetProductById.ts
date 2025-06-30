import { useQuery } from "@tanstack/react-query"; // là hook chính của thư viện React Query, giúp quản lý việc gọi API, cache, loading, lỗi...
import { getProductById } from "./api"; //thực hiện truy vấn sản phẩm theo id.

export function useGetProductById(id: string) {
  const {
    isLoading,
    data: product, //Kết quả trả về từ API (response.data). Đổi tên thành product.
    error,
  } = useQuery({
    queryKey: ["Products", id], // Key để React Query phân biệt cache. Dựa vào id, cache sẽ tách biệt từng sản phẩm.
    queryFn: () => getProductById(id), // Hàm fetch API khi cần thiết.
  });

  return { isLoading, product, error };
}

/**
Bước	Mô tả
1.	Component gọi useGetProductById(id)
2.	useQuery kiểm tra cache với ["Products", id]
3.	Nếu chưa có hoặc cache hết hạn → gọi getProductById(id)
4.	Khi đang gọi API → isLoading = true
5.	Khi nhận được phản hồi → product có dữ liệu
6.	Nếu có lỗi → error chứa thông tin lỗi
 */
