import { ColumnDef } from "@tanstack/react-table";
import ActionCell from "./ActionCell";
// import ActionCell from "./ActionCell";

interface IComment {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
  productId: {
    _id: string;
    name: string;
    image: string;
  };
  infoProductBuy: string;
  content: string;
  rating: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const column: ColumnDef<IComment>[] = [
  // {
  //   header: "STT",
  //   cell: ({ row }) => {
  //     return <span className="text-sm text-gray-500">{row.index + 1}</span>;
  //   },
  // },
  {
    header: "Tên sản phẩm",
    id: "productId.name", // Đặt id để liên kết với filter
    accessorFn: (row) => row.productId?.name || "",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-gray-500">
          {row.original.productId?.name || ""}
        </span>
      );
    },
  },
  {
    accessorKey: "image",
    header: "Ảnh sản phẩm",
    cell: ({ row }) => {
      return (
        <>
          {row.original.productId ? (
            <img
              src={row.original.productId.image}
              alt="product"
              className="size-9 md:size-14 object-cover rounded-full"
            />
          ) : (
            <img alt="sản phẩm" className="size-14 object-cover rounded-full" />
          )}
        </>
      );
    },
  },
  {
    accessorKey: "userId",
    header: "Tên người dùng",

    cell: ({ row }) => {
      return (
        <p>
          {row.original.userId.firstName} {row.original.userId.lastName}
        </p>
      );
    },
  },
  {
    accessorKey: "content",
    header: "Nội dung",
    cell: ({ row }) => {
      return (
        <p
          dangerouslySetInnerHTML={{
            __html: row.original.content,
          }}
        />
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Số sao",

    cell: ({ row }) => {
      return <span>{row.original.rating}</span>;
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
