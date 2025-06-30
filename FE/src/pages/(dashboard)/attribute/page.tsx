import { columnAttribute } from "./_components/Column"; // Cấu hình các cột
import { DataTable } from "./_components/DataTable"; // Component bảng
import Header from "./_components/Header"; // Phần tiêu đề + filter
import { useGetAttributes } from "./actions/useGetAllAttribute"; // Hook lấy dữ liệu

const AttributesPage = () => {
  const { isLoadingAttributes, attributes } = useGetAttributes();

  // Nếu đang loading thì hiển thị trạng thái chờ
  if (isLoadingAttributes) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="bg-white p-6">
        {/* Phần tiêu đề và tab lọc */}
        <Header />

        {/* Bảng hiển thị danh sách thuộc tính */}
        <div className="min-h-80 mt-5 grid grid-cols-1">
          <DataTable columns={columnAttribute} data={attributes} />
        </div>
      </div>
    </>
  );
};

export default AttributesPage;
