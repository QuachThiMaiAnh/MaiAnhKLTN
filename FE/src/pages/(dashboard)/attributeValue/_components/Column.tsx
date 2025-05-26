import { ColumnDef } from "@tanstack/react-table";

import ActionCell from "./ActionCell";

interface IAttributeValues {
  _id: string;
  name: string;
  value: string;
  type: string;
}

export const columnAttributeValues: ColumnDef<IAttributeValues>[] = [
  {
    // accessorKey: "_id",
    header: "#",
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "Tên",
  },

  {
    accessorKey: "value",
    header: "Giá trị",
    cell: ({ row }) => {
      const isColor = row.original.value.startsWith("#");
      return (
        <span
          className={`block ${isColor ? "size-5 rounded-full" : ""}`}
          style={{
            backgroundColor: isColor ? row.original.value : undefined,
            color: isColor ? "white" : "black", // Đổi màu chữ nếu cần
          }}
        >
          {!isColor && row.original.value}
        </span>
        // <span>{row.original.value}</span>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
