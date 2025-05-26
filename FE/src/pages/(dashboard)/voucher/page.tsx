
import useVoucher from "@/common/hooks/useVouher";
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { useEffect, useRef } from "react";
import { CirclePlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import VoucherAddForm from "./_components/VoucherAddForm";
import { Skeleton } from "@/components/ui/skeleton";
import { AiOutlineExclamationCircle } from "react-icons/ai";

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
type Voucher = {
    _id?: string;
    code: string;
    category: string;
    discount: number;
    countOnStock: number;
    type: string;
    status?: string;
    startDate: Date;
    endDate: string; // Sau khi định dạng
}

// Định nghĩa kiểu cho dữ liệu item
type Item = {
    voucher: Voucher;
    countdown: number;
};
const Demopage = () => {
    useEffect(() => {
        document.title = "Vouchers";
    }, []);
    const { getVoucher, changeStatusVoucher } = useVoucher();
    const { data, isLoading, isError } = getVoucher('get-all-countdown');
    const item = data?.map((item: Item) => {
        const localDate = new Date(new Date(item.voucher.endDate).getTime() - 7 * 60 * 60 * 1000);
        return {
            ...item.voucher,
            endDate: localDate.getDate() + '/' + (localDate.getMonth() + 1) + '/' + localDate.getFullYear() + ' '
                + localDate.getHours() + ':' +
                (localDate.getMinutes() < 10 ? '0' + localDate.getMinutes() : localDate.getMinutes())
        }
    })

    const interval = useRef<{ [key: string]: NodeJS.Timeout }>({});

    useEffect(() => {
        if (data) {
            data.forEach((item: Item) => {
                // if (item.countdown && item.countdown > 0) {
                startCountDown(item.countdown, item.voucher)
                // }
            });
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            Object.values(interval.current).forEach(clearInterval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };

    }, [data]);

    const handleVisibilityChange = () => {
        if (document.hidden) {
            Object.values(interval.current).forEach(clearInterval);
        } else if (data) {
            data.forEach((item: Item) => {
                if (item.countdown && item.countdown > 0) {
                    startCountDown(item.countdown, item.voucher);
                }
            });
        }
    };

    const startCountDown = (timeCountDown: number, voucher: Voucher) => {

        interval.current[voucher._id!] = setInterval(() => {
            // console.log(timeCountDown)
            if (timeCountDown <= 0) {
                if (voucher.status === 'active') {
                    changeStatusVoucher.mutate({ status: 'inactive', id: voucher._id });
                    clearInterval(interval.current[voucher._id!]);
                }
                return;
            }
            timeCountDown -= 1000;
        }, 1000);

    };

    if (isLoading) return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[325px] w-full rounded-xl bg-white" />
        </div>
    );
    if (isError) return (
        <div className="flex items-center justify-center p-[10rem] my-10   ">
            <AiOutlineExclamationCircle className="text-red-500 text-xl mr-2" />
            <span className="text-red-600 font-semibold">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</span>
        </div>
    );
    return (
        <div className="w-full mx-auto py-10">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Vouchers</h1>
                <Dialog>
                    <DialogTrigger>
                        <div className="flex px-3 py-2 rounded-md bg-orange-500 hover:bg-orange-400 cursor-pointer text-white items-center justify-between gap-2">
                            <CirclePlus size={16} />
                            <span>Thêm mới Voucher</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tạo Voucher</DialogTitle>
                            <DialogDescription>
                                Vui lòng điền vào mẫu dưới đây để tạo voucher mới
                            </DialogDescription>
                        </DialogHeader>
                        <VoucherAddForm />
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable columns={columns} data={item} />
        </div >
    )
}

export default Demopage