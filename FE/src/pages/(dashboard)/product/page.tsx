import { columnProducts } from "@/components/Column";
import { DataTable } from "@/components/DataTable";
import Header from "./_components/Header";

import { useGetAllProduct } from "./actions/useGetAllProduct";

const ProductPage = () => {
  const { isLoading, listProduct } = useGetAllProduct();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // console.log(listProduct);

  return (
    // <Container>
    <div className="bg-white p-6">
      <Header />

      <div className="min-h-80 mt-5">
        <DataTable columns={columnProducts} data={listProduct?.data} />
      </div>
    </div>
    // </Container>
  );
};

export default ProductPage;
