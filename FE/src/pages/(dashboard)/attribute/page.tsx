import { columnAttribute } from "./_components/Column";
import { DataTable } from "./_components/DataTable";
import Header from "./_components/Header";
import { useGetAtributes } from "./actions/useGetAllAttribute";

const AttributesPage = () => {
  const { isLoadingAtributes, atributes } = useGetAtributes();

  if (isLoadingAtributes) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="bg-white p-6">
        <Header />

        <div className="min-h-80 mt-5 grid grid-cols-1">
          <DataTable columns={columnAttribute} data={atributes} />
        </div>
      </div>
    </>
  );
};

export default AttributesPage;
