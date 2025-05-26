import { useParams } from "react-router-dom";
import { columnAttributeValues } from "./_components/Column";
import { DataTable } from "./_components/DataTable";
import Header from "./_components/Header";
import { useGetAtributes } from "./actions/useGetAllAttributeValues";

const AttributeValuePage = () => {
  const { id } = useParams();

  const { isLoading, atributeValues, error } = useGetAtributes(id!);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("atributeValues", atributeValues);

  return (
    <>
      <div className="bg-white p-6">
        <Header />

        <div className="mt-5 grid grid-cols-1">
          <DataTable
            columns={columnAttributeValues}
            data={atributeValues.length ? atributeValues[0].values : []}
          />
        </div>
      </div>
    </>
  );
};

export default AttributeValuePage;
