import { toast } from "@/components/ui/use-toast";
import SkeletonCart from "./SkeletonCart";
import useCart from "@/common/hooks/useCart";
import { useState } from "react";
// import CheckOutSubmitVoucher from "./CheckOutSubmitVoucher";
import { useUserContext } from "@/common/context/UserProvider";
import CheckSubmitOrder from "./CheckSubmitOrder";

interface Payload {
  productId?: string;
  variantId?: string;
  quantity?: number;
  [key: string]: string | number | boolean | undefined; // Dùng để hỗ trợ các trường khác nếu cần
}

const CheckOutCart = () => {
  const [, setAttribute] = useState<string | 1>("1");

  const { _id } = useUserContext();

  // const userId = "67370b2bba67ac60aea58be8"; // USER ID
  const { cart, isLoading, isError, addVoucher, removeVoucher, changeVariant } =
    useCart(_id);
  // console.log(cart)

  function userAction(action: { type: string }, value: Payload) {
    const item = {
      userId: _id,
      ...value,
    };
    // console.log(item)
    switch (action.type) {
      case "applyVoucher":
        addVoucher.mutate(item, {
          onSuccess: () => {
            // console.log(`Thêm mã giảm giá ${value.voucherCode} thành công`)
            toast({
              title: "Sucsess",
              description: `Thêm mã giảm giá ${value.voucherCode} thành công`,
            });
          },
        });
        break;

      case "removeVoucher":
        removeVoucher.mutate(item);
        break;

      case "changeVariant":
        changeVariant.mutate(item, {
          onSuccess: () => {
            toast({
              title: "Sucsess",
              description: "Đổi thành công!",
            });
            setAttribute("1");
          },
        });
        break;
    }
  }

  if (isLoading) return <SkeletonCart />;
  if (isError) return <div>Is Error</div>;

  return (
    <div>
      <CheckSubmitOrder cart={cart} userAction={userAction} />
    </div>
  );
};


export default CheckOutCart