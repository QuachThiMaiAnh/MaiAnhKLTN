import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { formatCurrencyVND } from "@/pages/(website)/orderHistory/OrderHistory";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string,
    orderCode: string,
    customer: string,
    phone: number,
    email: string,
    imageUrl: string,
    amount: number,
    payment: string,
    status: "chờ xác nhận" | "đã xác nhận" | "đang giao hàng",
}

export const columnsOrder: ColumnDef<{ id: string; amount: number; status: string; email: string; imageUrl: string; customer: string; phone: number | string; payment: string; }>[] = [
    {
        accessorKey: "orderCode",
        header: "Mã đơn hàng",
        cell: ({ row }) => (
            <Link to={`/admin/orders/orderdetails/${row?.original?.id}`}>
                <span className="text-sm font-semibold text-blue-600">
                    {row.getValue("orderCode")}
                </span>
            </Link>
        )
    },
    {
        accessorKey: "customer",
        header: "Người mua",
        cell: ({ row }) => {
            // console.log(row)
            return (
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={row?.original?.imageUrl === undefined ? "https://github.com/shadcn.png" : row?.original?.imageUrl} />
                        <AvatarFallback>{row.getValue("customer")}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{row.getValue("customer")}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Điện thoại",
    },
    {
        accessorKey: "amount",
        header: "Tổng đơn",
        cell: ({ row }) => {
            const amount = row.getValue("amount") as number;
            return <span className="text-sm">{formatCurrencyVND(amount)}</span>;
        }
    },
    {
        accessorKey: "payment",
        header: "Phương thức",
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Trạng thái' />
        ),
        cell: ({ row }) => {
            return (
                <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${row.getValue("status") === "chờ xác nhận"
                        ? "bg-yellow-100 text-yellow-800"
                        : row.getValue("status") === "đã xác nhận"
                            ? "bg-blue-100 text-blue-800"
                            : row.getValue("status") === "đang giao hàng"
                                ? "bg-green-100 text-green-800"
                                : row.getValue("status") === "đã hoàn thành"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-red-100 text-red-800"
                        }`}
                >
                    {row.getValue("status")}
                </span>
            )
        }
    },
]