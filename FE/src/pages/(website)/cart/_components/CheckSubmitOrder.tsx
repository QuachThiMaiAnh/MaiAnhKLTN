//icons

//other

import { ICart } from "@/common/types/cart";
import { formatCurrency } from "@/lib/utils";

interface Payload {
  productId?: string;
  variantId?: string;
  quantity?: number;
  [key: string]: string | number | boolean | undefined; // Dùng để hỗ trợ các trường khác nếu cần
}
const CheckSubmitOrder = ({
  cart,
}: {
  cart: ICart;
  userAction: (action: { type: string }, payload: Payload) => void;
}) => {

  return (
    <div>
      <div className="flex flex-col gap-6  border-[#F4F4F4] ">
        <div className="Subtotal flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="text-[#9D9EA2] transition-all duration-500 max-sm:text-[14px]">
              Tổng tiền hàng
            </p>
            <div>
              <span>{formatCurrency(cart?.subTotal ?? 0)} VNĐ</span>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-[#9D9EA2] transition-all duration-500 max-sm:text-[14px]">
              Giảm giá sản phẩm
            </p>
            <p className="">
              <span>{cart.discount !== undefined && cart?.discount > 0 ? `- ${formatCurrency(cart.discount)}` : 0} VNĐ</span>
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-[#9D9EA2] transition-all duration-500 max-sm:text-[14px]">
              Phí giao hàng
            </p>
            <div>
              <span>{formatCurrency(30000)}VNĐ</span>
            </div>
          </div>
          <div className="flex justify-between">
                        <p className="text-[#9D9EA2] transition-all duration-500 max-sm:text-[14px]">
                            Thành tiền
                        </p>
                        <div>
                            <span>{formatCurrency(cart.total ?? 0)}VNĐ</span>
                        </div>
                    </div>
        </div>

        {/* <div className='Free-Ship flex flex-col pt-4 gap-4 border-t border-[#F4F4F4]'>
                            <div className='relative'>
                                <div className='bg-[#F4F4F4] w-full h-[6px] rounded-full'></div>
                                <div className={`absolute bottom-0 bg-light-400 w-1/2 h-[6px] rounded-full `}></div>
                            </div>
                            <div className='flex flex-col gap-[6px] max-sm:*:text-[14px]'>
                                <p>Get Free <b className='font-medium text-[#17AF26]'>Shipping</b> for orders over <span className='text-red-500 font-medium'>$<span>100.00</span></span></p>
                                <div className='font-medium flex'>
                                    <div className='underline transition-all hover:text-light-400 hover:no-underline'>
                                        <a href="#">Continue Shopping</a>
                                    </div>
                                </div>
                            </div>
                        </div> */}
      </div>
    </div>
  );
};

export default CheckSubmitOrder