// import { useSearchParams } from "react-router-dom";

import { useGetAllComment } from "./actions/useGetAll";
import { column } from "./components/column";
import { DataTable } from "./components/DataTable";
import Header from "./components/Header";

const Comment = () => {
  const { isLoading, listComment, error } = useGetAllComment();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error...</div>;
  }

  return (
    <>
      <Header />

      <div className="min-h-80 mt-5">
        <DataTable columns={column} data={listComment} />
      </div>
    </>
  );
};

export default Comment;
