import { useSearchParams } from "react-router-dom";

import Header from "./components/Header";
import { useGetAllCategory } from "./actions/useGetAllCategory";
import { DataTable } from "./components/DataTable";
import { columnCategories } from "./components/columnCategories";

const CategotiesPage = () => {
  const { isLoading, listCategory, error } = useGetAllCategory();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />

      <div className="min-h-80 mt-5">
        <DataTable columns={columnCategories} data={listCategory} />
      </div>
    </>
  );
};

export default CategotiesPage;
