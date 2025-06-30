import { useParams } from "react-router-dom";
import { columnAttributeValues } from "./_components/Column";
import { DataTable } from "./_components/DataTable";
import Header from "./_components/Header";
import { useGetAtributes } from "./actions/useGetAllAttributeValues";

const AttributeValuePage = () => {
  const { id } = useParams();

  const { isLoading, atributeValues } = useGetAtributes(id!);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // atributeValues[0].values là danh sách giá trị bên trong 1 thuộc tính duy nhất
  const values = atributeValues?.length ? atributeValues[0].values : [];

  return (
    <div className="bg-white p-6">
      <Header />

      <div className="mt-5 grid grid-cols-1">
        <DataTable columns={columnAttributeValues} data={values} />
      </div>
    </div>
  );
};

export default AttributeValuePage;
