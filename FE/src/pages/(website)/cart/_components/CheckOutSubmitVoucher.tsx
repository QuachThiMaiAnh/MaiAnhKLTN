//icons

//other
import { ChevronRight, Ticket } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import CountdownVoucher from "./CountdownVoucher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formatCurrency } from "@/lib/utils";
import { ICart } from "@/common/types/cart";

interface Payload {
  productId?: string;
  variantId?: string;
  quantity?: number;
  [key: string]: string | number | boolean | undefined; // Dùng để hỗ trợ các trường khác nếu cần
} 

const formSchema = z.object({
  voucherCode: z.string().min(2, {
    message: "Không hợp lệ",
  }),
});

const CheckOutSubmitVoucher = ({
  cart,
  userAction,
}: {
  cart: ICart;
  userAction: (action: { type: string }, payload: Payload) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voucherCode: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    userAction({ type: "applyVoucher" }, values);
  }

  function handleApplyVoucher(item: string) {
    // console.log(item)
    userAction({ type: "applyVoucher" }, { voucherCode: item });
  }

  function handleRemoveVoucher(item: string) {
    // console.log(item)
    userAction({ type: "removeVoucher" }, { voucherCode: item });
  }

  return (
    <div>
      <div className="flex flex-col gap-6  border-[#F4F4F4] ">
        <div className="Subtotal flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="text-[#9D9EA2] transition-all duration-500 max-sm:text-[14px]">
              Tổng tiền
            </p>
            <div>
              <span>{formatCurrency(cart?.subTotal ?? 0)} VNĐ</span>
            </div>
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
              Giảm giá sản phẩm
            </p>
            <p className="">
              <span>{cart.discount !== undefined && cart?.discount > 0 ? `- ${formatCurrency(cart.discount)}` : 0} VNĐ</span>
             
            </p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <div>
              <Button
                variant="outline"
                type="button"
                className="w-full p-2 rounded-md bg-slate-200 grid grid-cols-[30px_auto_20px] justify-normal"
              >
                <div className="items-start">
                  <Ticket />
                </div>
                <div className="text-start truncate">
                  Select or enter a voucher
                </div>
                <div className="items-end">
                  <ChevronRight />
                </div>
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Discount and Voucher</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="Code-Sale flex items-start justify-between gap-4"
                >
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="voucherCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Discount code"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <button
                    className="py-3 px-5 rounded-full text-light-400 text-[14px] bg-light-50 whitespace-nowrap cursor-pointer transition-all duration-300 hover:bg-light-100 select-none"
                    type="submit"
                  >
                    Apply Coupon
                  </button>

                  <FormMessage />
                </form>
              </Form>
              <CountdownVoucher
                onApplyVoucher={handleApplyVoucher}
                onRemoveVoucher={handleRemoveVoucher}
                cart={cart}
              />
            </div>
          </DialogContent>
        </Dialog>
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

export default CheckOutSubmitVoucher;
