// Hook custom để xử lý API voucher (lấy danh sách, cập nhật trạng thái, ...)
import useVoucher from "@/common/hooks/useVouher";

// Cột hiển thị trong bảng
import { columns } from "./_components/columns";

// Thành phần bảng hiển thị dữ liệu
import { DataTable } from "./_components/data-table";

import { useEffect, useRef } from "react";
import { CirclePlus } from "lucide-react";

// Các thành phần giao diện của Dialog để hiển thị form thêm mới
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import VoucherAddForm from "./_components/VoucherAddForm";
import { Skeleton } from "@/components/ui/skeleton";
import { AiOutlineExclamationCircle } from "react-icons/ai";

// Định nghĩa kiểu dữ liệu Payment – có thể được sử dụng trong các phần khác của hệ thống
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
};

// Kiểu Voucher chính – lưu ý: endDate là string (đã được format lại để hiển thị)
type Voucher = {
  _id?: string;
  code: string;
  category: string;
  discount: number;
  countOnStock: number;
  type: string;
  status?: string;
  startDate: Date;
  endDate: string;
};

// Kiểu Item là dữ liệu chính lấy từ API
type Item = {
  voucher: Voucher;
  countdown: number; // Thời gian đếm ngược còn lại tính bằng milliseconds
};

const Demopage = () => {
  // Đặt tiêu đề trang
  useEffect(() => {
    document.title = "Mã giảm giá";
  }, []);

  const { getVoucher, changeStatusVoucher } = useVoucher(); // Gọi API

  //   Lấy danh sách voucher với trạng thái countdown
  const { data, isLoading, isError } = getVoucher("get-all-countdown");

  // Xử lý dữ liệu trả về, format lại endDate theo giờ Việt Nam
  const item = data?.map((item: Item) => {
    // Đúng: Cộng thêm 7 tiếng để chuyển sang giờ Việt Nam
    const localDate = new Date(new Date(item.voucher.endDate).getTime());
    return {
      ...item.voucher,
      endDate:
        localDate.getDate() +
        "/" +
        (localDate.getMonth() + 1) +
        "/" +
        localDate.getFullYear() +
        " " +
        localDate.getHours() +
        ":" +
        (localDate.getMinutes() < 10
          ? "0" + localDate.getMinutes()
          : localDate.getMinutes()),
    };
  });

  // Lưu lại các interval để clear khi cần thiết
  const interval = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    if (data) {
      // Bắt đầu đếm ngược cho mỗi voucher
      data.forEach((item: Item) => {
        startCountDown(item.countdown, item.voucher);
      });
    }

    // Xử lý khi người dùng chuyển tab (ẩn/hiện tab)
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // Clear tất cả interval khi unmount component
      Object.values(interval.current).forEach(clearInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [data]);

  // Khi người dùng chuyển sang tab khác, clear tất cả interval
  // Khi quay lại tab, restart lại các countdown
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

  // Bắt đầu quá trình đếm ngược
  const startCountDown = (timeCountDown: number, voucher: Voucher) => {
    interval.current[voucher._id!] = setInterval(() => {
      if (timeCountDown <= 0) {
        // Khi hết giờ và voucher vẫn đang active, đổi trạng thái thành inactive
        if (voucher.status === "active") {
          changeStatusVoucher.mutate({ status: "inactive", id: voucher._id });
          clearInterval(interval.current[voucher._id!]);
        }
        return;
      }
      // Giảm thời gian mỗi giây
      timeCountDown -= 1000;
    }, 1000);
  };

  // Loading UI khi đang gọi API
  if (isLoading)
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[325px] w-full rounded-xl bg-white" />
      </div>
    );

  // Error UI khi gọi API bị lỗi
  if (isError)
    return (
      <div className="flex items-center justify-center p-[10rem] my-10">
        <AiOutlineExclamationCircle className="text-red-500 text-xl mr-2" />
        <span className="text-red-600 font-semibold">
          Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
        </span>
      </div>
    );

  // UI chính
  return (
    <div className="w-full mx-auto py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Vouchers</h1>

        {/* Nút và dialog để tạo mới voucher */}
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

      {/* Bảng hiển thị danh sách voucher */}
      <DataTable columns={columns} data={item} />
    </div>
  );
};

export default Demopage;
