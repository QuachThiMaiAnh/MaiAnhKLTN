import { ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import {
    Sheet,
    // SheetClose,
    SheetContent,
    SheetDescription,
    // SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import VoucherForm from "./VoucherForm"
import { formatCurrency } from "@/lib/utils"


export type Payment = {
    _id?: string;
    code: string;
    category: string;
    discount: number;
    countOnStock: number;
    type: string;
    status?: string;
    startDate: Date;
    endDate: Date;
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "status",
        header: "Trang thái",
        cell: ({ row }) => {
            if (row.getValue('status') === 'inactive') {
                return <Badge className="capitalize bg-red-500" variant="destructive">Đóng</Badge>
            }
            return <Badge className="capitalize bg-green-500">Kích hoạt</Badge>
        }
    },
    {
        accessorKey: "code",
        header: "Mã Voucher",
    },
    // {
    //     accessorKey: "category",
    //     header: "Loại",
    // },
    {
        accessorKey: "discount",
        header: "Giảm giá",
        cell: ({ row }) => {
            if (row.original.type === 'percent') {
                return <div>{row.getValue('discount')}%</div>
            } else
                return <>{formatCurrency(row.getValue('discount'))} VNĐ</>
        }
    },
    {
        accessorKey: "countOnStock",
        header: "Số lượng",
    },

    {
        accessorKey: "endDate",
        header: "Ngày kết thúc",
    },
    {
        id: "actions",
        header: () => <div className="text-center">Thao tác</div>,
        cell: ({ row }) => {


            return (
                <div className="text-center">
                    <Sheet>
                        <SheetTrigger className="border rounded-md p-1 transition-all duration-300 hover:border-orange-400 hover:text-orange-400"><Eye size={20} /></SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Thông tin Voucher</SheetTitle>
                                <SheetDescription>
                                    Mã Voucher: {row.original.code}
                                </SheetDescription>
                            </SheetHeader>
                            <VoucherForm id={row.original._id || ''} />
                            {/* <SheetFooter>
                                <SheetClose asChild>
                                    <Button type="submit">Save changes</Button>
                                </SheetClose>
                            </SheetFooter> */}
                        </SheetContent>
                    </Sheet>
                </div>
            )
        },
    },
]