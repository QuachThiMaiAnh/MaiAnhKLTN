import { ColumnDef } from "@tanstack/react-table";
import ActionCell from "./ActionCell";

// Interface cho giá trị của từng thuộc tính
interface IAttributeValues {
  _id: string;
  name: string;
  value: string;
  type: string;
}

// Interface cho một thuộc tính (dòng chính trong bảng)
interface IAttribute {
  _id: string;
  name: string;
  values: IAttributeValues[];
}

export const columnAttribute: ColumnDef<IAttribute>[] = [
  {
    // Cột hiển thị số thứ tự (tính từ 1)
    header: "#",
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "name", // tên thuộc tính
    header: "Tên",
  },
  {
    accessorKey: "values", // giá trị của thuộc tính
    header: "Giá trị",
    cell: ({ row }) => {
      const attribute = row.original;

      return (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(attribute.values) && attribute.values.length > 0 ? (
            attribute.values.map((value, index) => (
              <span
                key={index}
                className="bg-gray-200 px-2 py-1 rounded text-sm"
                title={value.name}
              >
                {value.name}
              </span>
            ))
          ) : (
            <span className="text-gray-500 italic">Không có giá trị</span>
          )}
        </div>
      );
    },
  },
  {
    // Cột hành động (ẩn/hiện/sửa/xem thêm)
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
