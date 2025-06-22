import cartEmpty from "@/assets/images/cart-empty.png";
import { useUserContext } from "@/common/context/UserProvider";
import useAddress from "@/common/hooks/address/useAddress";
import useCart from "@/common/hooks/useCart";
import { Cart, FormOut } from "@/common/types/formCheckOut";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import CreateAddress from "../../address/CreatAddress";
import { Address } from "../../address/ListAddress";
import AddressDialog from "./AddressDialog ";
import sendOrderConfirmationEmail from "./sendEmail";
// import { useQueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import io from "socket.io-client";
import CheckOutCart from "./CheckOutCart";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Voucher } from "@/common/types/cart";
import { Product, VariantValue } from "@/common/types/Products";
const socket = io("http://localhost:3000");

interface ErrorResponse {
  message: string;
}
/// thông tin thanh toán
// số thẻ 9704198526191432198
// tên : 	NGUYEN VAN A
// ngày 07/15
const CheckOut = () => {
  const navigate = useNavigate();
  // const queryClient = useQueryClient();

  const form = useForm<FormOut>({
    defaultValues: {
      addressId: "",
      note: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const { user } = useUser();
  const { _id } = useUserContext() ?? {};
  const queryClient = useQueryClient(); // Đặt useQueryClient ở trên đầu
  const Gmail = user?.primaryEmailAddress?.emailAddress;
  const {
    data: addresses,
    isLoading: isLoadingAddresses,
    isError: adressError,
  } = useAddress(_id);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => setDialogOpen(false);
  // lấy dữ liệu giỏ hàng
  const { cart: carts, isLoading: isLoadingCart, isError } = useCart(_id ?? "");
  const fullName = user?.fullName;
  const onSubmit = async (data: FormOut) => {
    if (carts?.voucher?.length > 0) {
      const voucherChecks = carts.voucher.map(async (item: Voucher) => {
        const { data: voucherData } = await axios.get(
          `http://localhost:8080/api/voucher/get-one/${item._id}`
        );

        console.log("Voucher Data:", voucherData);
        if (voucherData?.status === "inactive") {
          throw new Error(
            `Voucher "${item.code}" đã ngưng hoạt động. Vui lòng chọn voucher khác hoặc gỡ bỏ voucher này`
          );
        }

        if (
          new Date().getTime() >=
          new Date(
            new Date(voucherData?.endDate).getTime() - 7 * 60 * 60 * 1000
          ).getTime()
        ) {
          throw new Error(
            `Voucher "${item.code}" đã hết hạn. Vui lòng chọn voucher khác hoặc gỡ bỏ voucher này.`
          );
        }

        if (voucherData?.countOnStock === 0) {
          throw new Error(
            `Voucher "${item.code}" đã hết số lượng. Vui lòng chọn voucher khác hoặc gỡ bỏ voucher này.`
          );
        }
      });

      try {
        await Promise.all(voucherChecks); // Chạy song song tất cả API kiểm tra voucher
      } catch (error) {
        const err = error as Error;
        toast({
          variant: "destructive",
          title: "Lỗi voucher",
          description: err.message,
        });
        return; // Dừng hàm onSubmit
      }
    }

    const selectedProducts =
      carts?.products?.filter((product: Cart) => product.selected) || [];
    const orderData = {
      addressId: data.addressId,
      products: selectedProducts,
      userId: _id,
      note: data.note,
      email: Gmail,
      fullName,
      voucher: carts?.voucher,
      discount: carts.discount,
      payment: data.paymentMethod,
      totalPrice: carts?.total ?? 0,
    };
    try {
      // Gửi yêu cầu tạo đơn hàng đến backend

      if (data.paymentMethod === "Vnpay") {
        const orderResponse = await axios.post(
          "http://localhost:8080/api/create-order-Vnpay",
          orderData
        );
        const createOrder = orderResponse.data;
        const orderCode = createOrder?.order?.orderCode;
        const response = await axios.post(
          "http://localhost:8080/api/create_payment_url",
          {
            amount: carts?.total ?? 0,
            orderCode: orderCode,
            bankCode: "VNB",
          }
        );
        const paymentUrl = response.data.redirectUrl;
        window.location.href = paymentUrl;
        // if (Gmail) {
        //   await sendOrderConfirmationEmail(Gmail, orderCode);
        // }
      }

      if (data.paymentMethod === "COD") {
        const response = await axios.post(
          "http://localhost:8080/api/create-order",
          orderData
        );
        const createOrder = response.data;
        const orderCode = createOrder?.order?.orderCode;
        const orderId = createOrder?.order?._id;

        if (data.paymentMethod === "COD" && response.status === 201) {
          queryClient.invalidateQueries({
            queryKey: ["CART"],
          });
          // Đơn hàng đã được tạo thành công
          toast({
            className: "bg-green-400 text-white h-auto",
            title: "Thành công!",
            description: "Đặt hàng thành công.",
            variant: "default",
          });

          // Lấy ảnh của sản phẩm đầu tiên trong danh sách sản phẩm đã chọn
          const firstProductImage = selectedProducts[0]?.productItem?.image;

          // Gửi sự kiện 'orderPlaced' đến server khi đơn hàng được tạo thành công
          socket.emit("orderPlaced", {
            orderId,
            orderCode,
            userId: _id,
            status,
            message: "Đặt hàng thành công!",
            productImage: firstProductImage,
          });

          // queryClient.invalidateQueries(["CART", _id]);
          navigate("/cart/order"); // Điều hướng đến trang đơn hàng
          // Gửi email xác nhận đơn hàng
          if (Gmail) {
            await sendOrderConfirmationEmail(Gmail, orderCode);
          }
        }
      }
    } catch (error: unknown) {
      console.error("Lỗi khi tạo đơn hàng: ", error);

      if (axios.isAxiosError(error)) {
        // Kiểm tra nếu error là một AxiosError
        const errResponse: ErrorResponse = error.response?.data;
        const message = errResponse?.message || "Đã có lỗi xảy ra";

        // Hiển thị thông báo lỗi từ backend
        toast({
          title: "Thất bại!",
          description: message,
          variant: "default",
        });
      } else {
        // Các lỗi khác như không thể kết nối hoặc lỗi cấu hình yêu cầu
        toast({
          title: "Lỗi hệ thống",
          description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
          variant: "default",
        });
      }
    }
  };
  if (adressError) {
    return (
      <div className="flex items-center justify-center p-[10rem] my-10   ">
        <AiOutlineExclamationCircle className="text-red-500 text-xl mr-2" />
        <span className="text-red-600 font-semibold">
          Lỗi khi tải địa chỉ. Vui lòng thử lại sau.
        </span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex items-center justify-center p-[10rem] my-10   ">
        <AiOutlineExclamationCircle className="text-red-500 text-xl mr-2" />
        <span className="text-red-600 font-semibold">
          Lỗi khi tải giỏ hàng. Vui lòng thử lại sau.
        </span>
      </div>
    );
  }

  const defaultAddress = addresses?.find(
    (address: Address) => address.isDefault
  );
  if (defaultAddress) {
    form.setValue("addressId", defaultAddress._id); // Đặt giá trị vào form state
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 2xl:w-[1408px] xl:w-[1200px] py-8 px-4 lg:w-[900px] mx-auto"
      >
        {/* địa chỉ */}

        <div>
          <div className="xBNaac"></div>
          <div className="px-4 py-8 border">
            <div className="flex gap-4 mb-4 items-center">
              <svg
                height={16}
                viewBox="0 0 12 16"
                width={12}
                className="shopee-svg-icon icon-location-marker"
              >
                <path
                  d="M6 3.2c1.506 0 2.727 1.195 2.727 2.667 0 1.473-1.22 2.666-2.727 2.666S3.273 7.34 3.273 5.867C3.273 4.395 4.493 3.2 6 3.2zM0 6c0-3.315 2.686-6 6-6s6 2.685 6 6c0 2.498-1.964 5.742-6 9.933C1.613 11.743 0 8.498 0 6z"
                  fillRule="evenodd"
                />
              </svg>
              <span className="text-[20px]">Địa chỉ nhận hàng</span>
            </div>
            <div className="flex flex-wrap items-center">
              {isLoadingAddresses ? (
                <Skeleton className="h-[27px] w-full" />
              ) : (
                <>
                  {addresses?.length === 0 ? (
                    <CreateAddress />
                  ) : (
                    <>
                      {addresses &&
                        addresses.length > 0 &&
                        addresses
                          .filter((address: Address) => address.isDefault)
                          .map((address: Address) => (
                            <div
                              key={address._id}
                              className="flex gap-5 text-[18px]"
                            >
                              <p className="font-semibold">
                                {address.name} {address.phone}
                              </p>
                              <p>
                                {address.addressDetail}, {address.districtId},
                                {address.cityId}, {address.country}
                              </p>
                              <Controller
                                name="addressId" // Trường này sẽ chứa _id của địa chỉ
                                control={control}
                                render={({ field }) => (
                                  <input
                                    type="hidden"
                                    {...field}
                                    value={defaultAddress?._id || ""}
                                  />
                                )}
                              />
                            </div>
                          ))}
                      <div
                        className="ml-[2%] px-4  text-[#b8cd06]"
                        style={{ border: "1px solid #b8cd06" }}
                      >
                        Mặc Định
                      </div>
                      <div
                        className="ml-[2.5%] text-blue-600 cursor-pointer flex-shrink-0 flex-1"
                        onClick={() => setDialogOpen(true)}
                      >
                        Thay đổi
                      </div>
                      {/* Dialog */}
                      <AddressDialog
                        isOpen={isDialogOpen}
                        onClose={handleDialogClose}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {/* end địa chỉ */}
        <div className=" 2xl:w-[1408px] xl:w-[1200px] py-8 px-4 lg:w-[900px] max-[830px]:flex-col max-[830px]:flex grid  xl:grid lg:grid-cols-[52%_40%] xl:grid-cols-[57%_auto] 2xl:grid-cols-[57%_auto] gap-x-[7%] mx-auto">
          <div className="">
            <div className="Top flex justify-between pb-6 border-b border-[#C8C9CB]">
              <p className="font-medium text-[24px] max-sm:text-[16px]">
                Giao hàng
              </p>
              {isLoadingCart ? (
                <Skeleton className="h-12 w-12 rounded-full" />
              ) : (
                <p className="text-[#9D9EA2] max-sm:text-[14px] transition-all duration-500">
                  {/* ({carts?.products.length}) */}
                </p>
              )}
            </div>
            <div className="Mid flex flex-col p-6 gap-6">
              {/* Cart__Product */}
              {carts?.products.length === 0 && (
                <div className="flex flex-col items-center justify-center">
                  <img src={cartEmpty} alt="cart-empty" className="w-1/5" />
                  <p className="text-[#9D9EA2] max-sm:text-[14px]">
                    Your cart is empty
                  </p>
                </div>
              )}
              {isLoadingCart ? (
                <div className="grid grid-cols-2 space-y-3">
                  <Skeleton className="h-[50px] w-[71px] rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ) : (
                <>
                  {carts?.products
                    .filter((item: Product) => item.selected)
                    .map((item: Product, index: number) => (
                      <div
                        key={index}
                        className="grid transition-all duration-500 grid-cols-[81px_auto] max-sm:grid-cols-[75px_auto] gap-x-4 border-[#F4F4F4] border-b pb-6"
                      >
                        {/* Image  */}
                        <div className="Image_Product">
                          <div className="border border-[#dddcdc] rounded-[6px] p-1">
                            <img
                              className="w-full h-full"
                              src={item.productItem.image}
                              alt="img"
                            />
                          </div>
                        </div>
                        {/* information */}
                        <div className="flex flex-col gap-3">
                          <div className="flex max-sm:grid max-sm:grid-cols-[50%_auto] justify-between items-center gap-4">
                            <div className="text-[#9D9EA2] flex w-[45%] max-sm:w-full transition-all duration-500 max-sm:text-[14px]">
                              <div className="hover:text-black">
                                <Link to={`#`}>{item.productItem.name}</Link>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 max-sm:col-start-1">
                              <div className="flex rounded-[6px] *:transition-all duration-500 max-w-[8rem]">
                                <div className="border border-[#F4F4F4] rounded-[4px] bg-[#F4F4F4] px-[12.8px] py-[5px] text-black flex justify-center items-center">
                                  <input
                                    className="p-0 w-8 bg-transparent border-0 text-gray-800 text-center focus:ring-0"
                                    style={{ MozAppearance: "textfield" }}
                                    type="text"
                                    min={1}
                                    value={item.quantity}
                                    title="Quantity"
                                    placeholder="Enter quantity"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="">
                              <p>
                                <span>
                                  {formatCurrency(
                                    item.variantItem.priceSale ||
                                      item.variantItem.price
                                  )}{" "}
                                  VNĐ
                                </span>
                              </p>
                            </div>
                          </div>
                          {/* Attribute  */}
                          <div className="flex items-center gap-4 justify-between">
                            <p className="text-[#9D9EA2] w-[52%] max-[1408px]:w-[49%] max-xl:w-[47%] max-lg:w-[52%] transition-all duration-500 max-sm:text-[14px]">
                              Phân loại
                            </p>
                            <div className="relative">
                              {/* Attribute__Table  */}
                              <div className="flex items-center gap-1 px-2 py-1 border rounded-md cursor-pointer max-sm:text-[14px] select-none">
                                {item.variantItem.values.map(
                                  (value: VariantValue, index: number) => (
                                    <div key={value._id}>
                                      {value.type}: {value.name}
                                      {index <
                                      item.variantItem.values.length - 1
                                        ? ","
                                        : ""}
                                    </div>
                                  )
                                )}
                              </div>
                              {/* End Attribute__Table  */}
                            </div>
                          </div>
                          {/* End Attribute  */}
                          <div>
                            <p className="text-[#9D9EA2] transition-all duration-500 max-sm:text-[14px]">
                              Còn {item.variantItem.countOnStock} sản phẩm
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </>
              )}
              {/* End Cart__Product */}
              <FormField
                control={control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">LỜI NHẮN*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Lưu ý cho người bán..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{errors.note?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-6 border border-[#F4F4F4] rounded-[16px] p-6">
              <CheckOutCart />
              <hr />
              <FormField
                control={control}
                name="agreeToTerms"
                rules={{ required: "Bạn phải đồng ý với điều khoản" }}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-4">
                      <Checkbox
                        checked={field.value} // Liên kết với react-hook-form
                        onCheckedChange={(checked) => field.onChange(checked)} // Sử dụng onCheckedChange thay vì onChange
                        className="w-[22px] mt-[1%] h-[22px]"
                      />
                      <span className="text-[#717378] text-[14px]">
                        Tôi xác nhận rằng địa chỉ của tôi là chính xác 100% và
                        SẼ KHÔNG bắt Top Shelf BC phải chịu trách nhiệm nếu lô
                        hàng này được gửi đến địa chỉ không chính xác. *
                      </span>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.agreeToTerms.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="emailUpdates"
                rules={{
                  required: "Bạn cần đăng ký để nhận Email về đơn hàng! ",
                }}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value} // Liên kết với react-hook-form
                        onCheckedChange={(checked) => field.onChange(checked)} // Sử dụng onCheckedChange thay vì onChange
                        className="w-[22px] h-[22px]"
                      />
                      <span className="text-[#717378] text-[14px]">
                        Đăng ký để nhận email đơn hàng
                      </span>
                    </div>
                    {errors.emailUpdates && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.emailUpdates.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              {/* ============= PAYMENTMEDTHOD=============== */}
              <div className="w-full mx-auto">
                <FormField
                  control={control}
                  name="paymentMethod"
                  rules={{ required: "VUI LÒNG CHỌN PHƯƠNG THỨC THANH TOÁN!" }}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value); // Cập nhật giá trị trong form
                          // Ngăn ngừa submit nếu có sự kiện submit ngoài mong muốn
                          // (ví dụ nếu bạn có một sự kiện submit trigger do việc thay đổi select)
                        }}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phương thức thanh toán" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vnpay">Vnpay</SelectItem>
                          <SelectItem value="COD">COD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription></FormDescription>
                      <FormMessage>{errors.paymentMethod?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              {/* ============= PAYMENTMEDTHOD=============== */}

              <button
                type="submit"
                className="bg-light-400 hover:bg-light-500 transition-all duration-300 flex justify-center items-center w-full py-4 gap-4 rounded-full text-white font-medium cursor-pointer select-none"
              >
                <div>ĐẶT HÀNG</div>
                <div className="">|</div>
                <div>{formatCurrency(carts?.total)} VNĐ</div>
              </button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CheckOut;
