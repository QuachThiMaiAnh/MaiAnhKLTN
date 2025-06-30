import { columnProducts } from "@/components/Column";
import { DataTable } from "@/components/DataTable";
import Header from "./_components/Header";

import { useGetAllProduct } from "./actions/useGetAllProduct";

const ProductPage = () => {
  const { isLoading, listProduct } = useGetAllProduct(); // Hook lấy danh sách sản phẩm

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    // <Container>
    <div className="bg-white p-6">
      <Header />

      <div className="min-h-80 mt-5">
        {/* Hiển thị bảng dữ liệu sản phẩm */}
        <DataTable columns={columnProducts} data={listProduct?.data} />
      </div>
    </div>
    // </Container>
  );
};

export default ProductPage;
