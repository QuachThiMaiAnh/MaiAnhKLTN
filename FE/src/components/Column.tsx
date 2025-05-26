import { IProduct } from "@/common/types/Orders";
import { formatCurrency } from "@/lib/utils";
import ActionCell from "@/pages/(dashboard)/product/_components/ActionCell";
import { ColumnDef } from "@tanstack/react-table";

export const columnProducts: ColumnDef<IProduct>[] = [
  {
    accessorKey: "image",
    header: "Ảnh",

    cell: ({ row }) => {
      const attribute = row.original;

      return (
        <img
          src={attribute.image}
          alt={attribute.name}
          className="size-14 md:size-20 object-cover rounded"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Tên",
  },
  {
    accessorKey: "category",
    header: "Danh mục",
    cell: ({ row }) => {
      const attribute = row.original;
      const targetId = "675dadfde9a2c0d93f9ba531";

      const exists = attribute.category.find(
        (category) => category._id == targetId
      )
        ? true
        : false;

      const categories =
        attribute.category.length >= 2 && exists
          ? attribute.category.filter((category) => category._id !== targetId)
          : attribute.category;

      return (
        <span className="text-sm text-gray-500">
          {categories.map((category) => category.name).join(", ") ||
            "Không có danh mục"}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Giá",
    cell: ({ row }) => {
      const attribute = row.original;

      return (
        <span className="text-sm text-gray-500">
          {formatCurrency(attribute.price)} VNĐ
        </span>
      );
    },
  },
  {
    accessorKey: "priceSale",
    header: "Giá khuyến mãi",
    cell: ({ row }) => {
      const attribute = row.original;

      return (
        <span className="text-sm text-gray-500">
          {attribute.priceSale
            ? formatCurrency(attribute.priceSale) + " VNĐ"
            : "Không có"}
        </span>
      );
    },
  },
  {
    accessorKey: "countOnStock",
    header: "Số lượng",
    cell: ({ row }) => {
      const attribute = row.original;

      return (
        <span className="text-sm text-gray-500">
          {formatCurrency(attribute.countOnStock)}
        </span>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

// {
//   accessorKey: "values",
//   header: "Giá trị",
//   cell: ({ row }) => {
//     const attribute = row.original;

//     return (
//       <div className="flex space-x-2">
//         {Array.isArray(attribute.values) && attribute.values.length > 0 ? (
//           attribute.values.map((value, index) => (
//             <span
//               key={index}
//               className="bg-gray-200 px-2 py-1 rounded"
//               title={value.name}
//             >
//               {value.name}
//             </span>
//           ))
//         ) : (
//           <span className="text-gray-500">Không có giá trị</span>
//         )}
//       </div>
//     );
//   },
// },
