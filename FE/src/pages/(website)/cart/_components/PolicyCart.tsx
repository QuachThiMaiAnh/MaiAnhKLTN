import minius from '@/assets/icons/transaction-minus.svg';
import boxtime from '@/assets/icons/box-time.svg';
import trucktime from '@/assets/icons/truck-time.svg';

const PolicyCart = () => {
    return (
        <div className="Bottom border-t border-[#F4F4F4] pt-6 grid grid-cols-3 gap-6 max-sm:gap-4">
            <div className='flex gap-4 flex-col'>
                <p className='text-[16px] max-sm:text-[14px]'>Vận chuyển</p>
                <div className='flex flex-col border border-[#F4F4F4] rounded-[12px] p-4 gap-4'>
                    <div className='Icon flex justify-center items-center w-1 h-1 bg-[#b8cd06] p-6 rounded-full'>
                        <img className='max-w-max' src={minius} alt="" />
                    </div>
                    <p className='sm:text-[18px] text-[14px] max-sm:truncate'>
                        Đặt hàng trước 10 giờ tối để được giao hàng miễn phí vào ngày hôm sau đối với Đơn hàng trên $100
                    </p>
                    <p className='text-[#717378] hidden sm:inline'>
                        Chúng tôi giao hàng từ thứ Hai đến thứ Bảy - trừ ngày lễ
                    </p>
                </div>
            </div>
            <div className='flex gap-4 flex-col'>
                <p className='text-[16px] max-sm:text-[14px]'>Thời gian</p>
                <div className='flex flex-col border border-[#F4F4F4] rounded-[12px] p-4 gap-4'>
                    <div className='Icon flex justify-center items-center w-1 h-1 bg-[#b8cd06] p-6 rounded-full'>
                        <img className='max-w-max' src={boxtime} alt="" />
                    </div>
                    <p className='sm:text-[18px] text-[14px] max-sm:truncate'>
                        Giao hàng miễn phí vào ngày hôm sau tới các cửa hàng.
                    </p>
                    <p className='text-[#717378] hidden sm:inline'>
                        Giao hàng tận nhà là 4,99 USD cho các đơn hàng dưới 100 USD và MIỄN PHÍ cho tất cả các đơn hàng trên 100 USD
                    </p>
                </div>
            </div>
            <div className='flex gap-4 flex-col'>
                <p className='text-[16px] max-sm:text-[14px] max-[450px]:truncate'>Miễn phí hoàn trả</p>
                <div className='flex flex-col border border-[#F4F4F4] rounded-[12px] p-4 gap-4'>
                    <div className='Icon flex justify-center items-center w-1 h-1 bg-[#b8cd06] p-6 rounded-full'>
                        <img className='max-w-max' src={trucktime} alt="" />
                    </div>
                    <p className='sm:text-[18px] text-[14px] max-sm:truncate'>
                        30 ngày để trả lại cho chúng tôi để được hoàn lại tiền
                    </p>
                    <p className='text-[#717378] hidden sm:inline'>
                        Chúng tôi đã thực hiện việc trả lại hàng RẤT DỄ DÀNG - giờ đây bạn có thể trả lại đơn hàng của mình đến cửa hàng hoặc gửi hàng qua FedEx MIỄN PHÍ
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PolicyCart