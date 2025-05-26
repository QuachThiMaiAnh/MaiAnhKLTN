import { useUserContext } from '@/common/context/UserProvider';
import useVoucher from '@/common/hooks/useVouher';
import { TicketPercent, Truck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { AiOutlineExclamationCircle } from "react-icons/ai";


interface Voucher {
  _id: string;
  code: string;
  discount: number;
  type: 'fixed' | 'percent';
  status: 'active' | 'inactive';
  category: 'product' | 'shipping';
}

interface VoucherItem {
  voucher: Voucher;
  countdown: number;
  status: 'active' | 'inactive';
  voucherId: string;

}

const VoucherStorage = () => {
    const { _id } = useUserContext();
    const { getVoucher, } = useVoucher()
    const { data, isLoading, isError } = getVoucher('get-all-countdown')
    const { data: voucherUsage, isLoading: isLoading2, isError: isError2 } = getVoucher('get-all-usage', _id)

    // console.log(data)
    useEffect(() => {
        document.title = "Kho voucher";
    }, []);

    const intervals = useRef<{ [key: string]: NodeJS.Timeout }>({}); // Lưu trữ các interval
    useEffect(() => {
        if (data) {
            data.forEach((item: VoucherItem) => {
                const present = item.countdown;
                if (item.voucher.status === 'active' && present > 0) {
                    startCountdown(present, item.voucher._id);
                }
            });
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            Object.values(intervals.current).forEach(clearInterval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [data]);

    const handleVisibilityChange = () => {
        if (document.hidden) {
            // Dừng countdown khi tab không còn visible
            Object.values(intervals.current).forEach(clearInterval);
        } else {
            // Bắt đầu lại countdown khi tab visible
            if (data) {
                data.forEach((item: VoucherItem) => {
                    const present = item.countdown;
                    if (item.status === 'active' && present > 0) {
                        startCountdown(present, item.voucher._id);
                    }
                });
            }
        }
    };

    function startCountdown(timeRemaining: number, id: string) {
        const countdownElement = document.getElementById(`countdown-${id}`);
        const parentDiv = countdownElement?.closest('.voucher-item');

        if (!countdownElement) return;

        intervals.current[id] = setInterval(() => {
            if (timeRemaining <= 60000) {
                countdownElement.classList.add('text-red-500');
            }
            if (timeRemaining <= 0) {
                clearInterval(intervals.current[id]);
                countdownElement.innerText = "Voucher đã hết hạn";
                if (parentDiv) {
                    parentDiv.classList.add('pointer-events-none');
                }
                // changeStatusVoucher.mutate({ status: 'inactive', id });
                return;
            }

            const hours = Math.floor((timeRemaining / (1000 * 60 * 60)));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            countdownElement.innerText = `${hours}h ${minutes}m ${seconds}s`;

            timeRemaining -= 1000;
        }, 1000);
    }

    if (_id === null) return <div className='max-w-[1000px] h-screen py-10 px-16 flex flex-col gap-8 mx-auto text-center'>Bạn cần đăng nhập để xem kho voucher</div>
    if (isLoading) return <div>Loading...</div>;
    if (isError) return (
        <div className="flex items-center justify-center p-[10rem] my-10   ">
            <AiOutlineExclamationCircle className="text-red-500 text-xl mr-2" />
            <span className="text-red-600 font-semibold">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</span>
        </div>
    );
    if (isLoading2) return <div>Loading...</div>;
    if (isError2) return (
        <div className="flex items-center justify-center p-[10rem] my-10   ">
            <AiOutlineExclamationCircle className="text-red-500 text-xl mr-2" />
            <span className="text-red-600 font-semibold">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</span>
        </div>
    );
    return (
        <div className='max-w-[1000px] h-screen py-10 px-16 flex flex-col gap-8 mx-auto'>
            <div className='text-2xl font-bold border-b border-zinc-400 pb-3'>
                <h1>Kho Voucher</h1>
            </div>
            <div className='flex flex-col h-screen overflow-y-auto gap-4'>
                {data?.map((item: VoucherItem) => {
                    // console.log(matchedVoucher)
                    const matchedVoucherUsage = voucherUsage?.find((voucher: VoucherItem) => voucher.voucherId === item.voucher._id);
                    if (item.voucher.status === 'active' && item.countdown > 0 && !matchedVoucherUsage) {
                        return (
                            <div key={item.voucher._id} className={`voucher-item p-3 w-full grid grid-cols-[68px_auto] gap-x-3 transition-all duration-200 border rounded-md border-gray-300 ${matchedVoucherUsage ? 'pointer-events-none relative' : ''}`}>
                                <div className='bg-slate-300 flex justify-center items-center p-1'>
                                    {item.voucher.category === 'product'
                                        ? <TicketPercent size={42} />
                                        : <Truck size={42} />
                                    }
                                </div>
                                <div className='flex justify-between text-[13px] sm:text-[16px]'>
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex'>
                                            <div className='border-2 p-1 rounded-md border-light-400 text-light-400 text-xs'>
                                                <p>{item.voucher.code}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p>Giảm {item.voucher.discount.toLocaleString()}{item.voucher.type === 'fixed' ? 'đ' : '%'}</p>
                                        </div>
                                    </div>
                                    <div className='text-gray-400 flex gap-2 items-center'>
                                        <div>HSD:</div>
                                        <div className='' id={`countdown-${item.voucher._id}`}></div>
                                    </div>
                                </div>
                                {/* //kiểm tra voucher đã sử dụng */}
                                {/* <div className={`${matchedVoucherUsage ? 'absolute' : 'hidden'} w-full h-full bg-white bg-opacity-70 flex flex-col justify-center items-center text-red-500 font-semibold`}>
                                    <span className='bg-red-500 z-20 text-white text-[14px] p-2 rounded-md'>Voucher đã được sử dụng</span>
                                </div> */}
                            </div>
                        );
                    } else return null;
                })}
            </div>
        </div>
    );
}

export default VoucherStorage