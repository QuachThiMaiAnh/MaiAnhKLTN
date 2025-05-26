import { Category } from "@/common/types/Orders";

import { ColumnDef } from "@tanstack/react-table";
import ActionCell from "./ActionCell";

export const columnCategories: ColumnDef<Category>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <span className="text-sm text-gray-500">{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "image",
    header: "Ảnh danh mục",
    cell: ({ row }) => {
      // console.log(row);
      return (
        <img
          src={row.original.image}
          alt="product"
          className="size-14 object-cover rounded-full"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Tên",
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
