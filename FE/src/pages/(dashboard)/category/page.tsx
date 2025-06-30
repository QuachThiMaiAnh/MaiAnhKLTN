import Header from "./components/Header";
import { useGetAllCategory } from "./actions/useGetAllCategory";
import { DataTable } from "./components/DataTable";
import { columnCategories } from "./components/columnCategories";

const CategoriesPage = () => {
  const { isLoading, categories, error } = useGetAllCategory(); // Note: Sử dụng hook để lấy danh sách danh mục

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />

      <div className="min-h-80 mt-5">
        <DataTable columns={columnCategories} data={categories} />
      </div>
    </>
  );
};

export default CategoriesPage;
