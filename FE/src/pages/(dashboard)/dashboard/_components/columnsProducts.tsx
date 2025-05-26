import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  _id: string;
  image: string;
  productName: string;
  slug: string;
  quantity: number;
  category: [];
};

export const columnsProducts: ColumnDef<Payment>[] = [
  // {
  //     header: "Xếp hạng",
  //     cell: ({ row }) => (
  //         <div className="flex items-center">
  //             <span className="text-sm font-medium">{row.index + 1}</span>
  //         </div>
  //     )
  // },
  {
    accessorKey: "image",
    header: "Ảnh sản phẩm",
    cell: ({ row }) => (
      <img
        src={row.getValue("image")}
        alt={row.getValue("productName")}
        className="w-12 h-14 rounded-lg"
      />
    ),
  },
  {
    accessorKey: "productName",
    header: "Tên sản phẩm",
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
    accessorKey: "quantity",
    header: "Số lượng bán",
  },
];
