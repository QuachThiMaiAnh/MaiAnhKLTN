import { useUserContext } from '@/common/context/UserProvider';
import useVoucher from '@/common/hooks/useVouher';
import { ICart, Voucher } from '@/common/types/cart';
import { CircleCheck, CirclePlus, CircleX, TicketPercent, Truck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'

interface CountdownVoucherProps {
    onApplyVoucher: (voucherCode: string) => void;
    onRemoveVoucher: (voucherCode: string) => void;
    cart: ICart; // Giả sử Cart là kiểu dữ liệu của giỏ hàng
  }
  
  interface CountdownItem {
    voucher: Voucher;
    countdown: number;  // Thời gian đếm ngược còn lại (tính bằng ms)
  }
  interface VoucherUsage {
    voucherId: string;
    userId: string;
    appliedAt: string; // Thời gian áp dụng voucher
  }
  
 
  

const CountdownVoucher = ({ onApplyVoucher, onRemoveVoucher, cart }: CountdownVoucherProps) => {
    const { _id } = useUserContext();
    const [isHover, setIsHover] = useState<string | false>(false);
    const { getVoucher, changeStatusVoucher } = useVoucher()
    const { data, isLoading, isError } = getVoucher('get-all-countdown')
    const { data: voucherUsage, isLoading: isLoading2, isError: isError2 } = getVoucher('get-all-usage', _id)

    // console.log(voucherUsage?.length)

    const intervals = useRef<{ [key: string]: NodeJS.Timeout }>({}); // Lưu trữ các interval

    useEffect(() => {
        if (data) {
            data.forEach((item: CountdownItem) => {
                const present = item.countdown;
                if (item.voucher.status === 'active' && present > 0) {
                    startCountdown(present, item.voucher);
                }
            });
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            Object.values(intervals.current).forEach(clearInterval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [data, cart]);

    const handleVisibilityChange = () => {
        if (document.hidden) {
            // Dừng countdown khi tab không còn visible
            Object.values(intervals.current).forEach(clearInterval);
        } else {
            // Bắt đầu lại countdown khi tab visible
            if (data) {
                data.forEach((item: CountdownItem) => {
                    const present = item.countdown;
                    // if (item.status === 'active' && present > 0) {
                    startCountdown(present, item.voucher);
                    // }
                });
            }
        }
    };

    function startCountdown(timeRemaining: number, voucher: Voucher) {
        const countdownElement = document.getElementById(`countdown-${voucher._id}`);
        const parentDiv = countdownElement?.closest('.voucher-item');

        if (!countdownElement) return;

        intervals.current[voucher._id] = setInterval(() => {
            if (timeRemaining <= 60000) {
                countdownElement.classList.add('text-red-500');
            }
            if (timeRemaining <= 0) {
                clearInterval(intervals.current[voucher._id]);
                countdownElement.innerText = "Voucher đã hết hạn";
                if (parentDiv) {
                    parentDiv.classList.add('pointer-events-none');
                }
                changeStatusVoucher.mutate({ status: 'inactive', id: voucher._id });
                // onRemoveVoucher(voucher.code);
            }

            const hours = Math.floor((timeRemaining / (1000 * 60 * 60)));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            countdownElement.innerText = `${hours}h ${minutes}m ${seconds}s`;

            timeRemaining -= 1000;
        }, 1000);
    }

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error</div>;
    if (isLoading2) return <div>Loading2...</div>;
    if (isError2) return <div>Error2</div>;
    return (
        <div className='w-full flex flex-col gap-2'>
            <div className='text-'>
                <h1>Voucher</h1>
            </div>
            <div className='flex flex-col max-h-[400px] overflow-y-auto gap-4'>
                {data?.map((item: CountdownItem) => {
                    // kiểm tra xem voucher có trong giỏ hàng không
                    const matchedVoucher = cart?.voucher?.find((voucher: Voucher) => voucher._id === item.voucher._id);
                    // kiểm tra xem voucher đã được sử dụng chưa
                    const matchedVoucherUsage = voucherUsage?.find((voucher: VoucherUsage) => voucher.voucherId === item.voucher._id);
                    // kiểm tra xem voucher có trong giỏ hàng không
                    const matchedVoucherCart = cart?.voucher?.find((voucher: Voucher) => voucher._id === item.voucher._id);

                    const isVoucherActive =
                        item.voucher.status === 'active' &&
                        item.countdown > 0 &&
                        item.voucher.countOnStock > 0 &&
                        !matchedVoucherUsage;

                    // const isVoucherDisabled =
                    //     matchedVoucherUsage ||
                    //     item.voucher.status !== 'active' ||
                    //     item.countdown <= 0 ||
                    //     item.voucher.countOnStock <= 0;


                    if (!isVoucherActive && matchedVoucherCart) {
                        // Voucher không khả dụng nhưng có trong giỏ hàng
                        return (
                            <div
                                key={item.voucher._id}
                                className={`voucher-item p-3 w-full z-0 relative grid grid-cols-[15%_auto_5.5%] gap-x-3 transition-all duration-200 border rounded-md bg-gray-100 bg-opacity-60`}
                            >
                                <div className='bg-slate-300 flex justify-center items-center p-1'>
                                    {item.voucher.category === 'product' ? <TicketPercent size={42} /> : <Truck size={42} />}
                                </div>
                                <div className='flex flex-col justify-between gap-5 text-[13px] sm:text-[16px]'>
                                    <div className='flex gap-3 items-center'>
                                        <div className='border-2 p-1 rounded-md border-light-400 text-light-400 text-xs'>
                                            <p>{item.voucher.code}</p>
                                        </div>
                                        <div>
                                            <p>Giảm {item.voucher.discount.toLocaleString()}{item.voucher.type === 'fixed' ? 'đ' : '%'}</p>
                                        </div>
                                    </div>
                                    <div className='text-gray-400 flex gap-2'>
                                        <div>HSD:</div>
                                        <div className='text-red-500'>Voucher không khả dụng</div>
                                    </div>
                                </div>
                                <div
                                    onClick={() => onRemoveVoucher(item.voucher.code)}
                                    className='absolute w-full h-full cursor-pointer z-20 bg-white bg-opacity-70 flex flex-col justify-center items-center text-red-500 font-semibold'
                                >
                                    <span className='bg-red-500 z-20 text-white text-[14px] p-2 rounded-md'>
                                        Voucher không khả dụng, chạm vào để gỡ
                                    </span>
                                </div>
                            </div>
                        );
                    } else if (isVoucherActive) {
                        // Voucher khả dụng
                        return (
                            <div
                                key={item.voucher._id}
                                className={`voucher-item p-3 w-full grid grid-cols-[15%_auto_5.5%] gap-x-3 transition-all duration-200 border rounded-md ${matchedVoucher ? 'border-black' : 'border-gray-300'
                                    }`}
                            >
                                <div className='bg-slate-300 flex justify-center items-center p-1'>
                                    {item.voucher.category === 'product' ? <TicketPercent size={42} /> : <Truck size={42} />}
                                </div>
                                <div className='flex flex-col justify-between gap-5 text-[13px] sm:text-[16px]'>
                                    <div className='flex gap-3 items-center'>
                                        <div className='border-2 p-1 rounded-md border-light-400 text-light-400 text-xs'>
                                            <p>{item.voucher.code}</p>
                                        </div>
                                        <div>
                                            <p>Giảm {item.voucher.discount.toLocaleString()}{item.voucher.type === 'fixed' ? 'đ' : '%'}</p>
                                        </div>
                                    </div>
                                    <div className='text-gray-400 flex gap-2'>
                                        <div>HSD:</div>
                                        <div className='' id={`countdown-${item.voucher._id}`}></div>
                                    </div>
                                </div>
                                <div className={`${matchedVoucherUsage ? 'hidden' : 'flex'} items-center select-none`}>
                                    {matchedVoucher ? (
                                        <div
                                            onMouseEnter={() => setIsHover(matchedVoucher._id)}
                                            onMouseLeave={() => setIsHover(false)}
                                            className='cursor-pointer'
                                            onClick={() => onRemoveVoucher(matchedVoucher.code)}
                                        >
                                            {isHover === matchedVoucher._id ? <CircleX color='red' /> : <CircleCheck />}
                                        </div>
                                    ) : (
                                        <CirclePlus
                                            onClick={() => onApplyVoucher(item.voucher.code)}
                                            className='text-gray-300 hover:text-black cursor-pointer'
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}

export default CountdownVoucher;
