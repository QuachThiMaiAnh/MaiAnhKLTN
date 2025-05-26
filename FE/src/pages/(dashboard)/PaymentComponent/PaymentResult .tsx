import { useEffect, useRef, useState, useMemo } from "react";
import axios, { AxiosError } from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useUserContext } from "@/common/context/UserProvider";
import { useUser } from "@clerk/clerk-react";
import useCart from "@/common/hooks/useCart";
import { Cart } from "@/common/types/formCheckOut";
import io from "socket.io-client";
import sendOrderConfirmationEmail from "@/pages/(website)/cart/_components/sendEmail";

const socket = io("http://localhost:3000");
const apiUrl = import.meta.env.VITE_API_URL;

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const Gmail = user?.primaryEmailAddress?.emailAddress;
  const { _id } = useUserContext() ?? {};
  const { cart: carts } = useCart(_id ?? "");
  
  const [result, setResult] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const emailSentRef = useRef(false);
  const notificationSentRef = useRef(false);
  const orderId = searchParams.get("vnp_TxnRef");

  // Lọc sản phẩm đã chọn từ giỏ hàng
  const orderCart = useMemo(() => {
    return carts?.products?.filter((product: Cart) => product.selected) || [];
  }, [carts]);

  // Lấy kết quả thanh toán từ VNPay
  useEffect(() => {
    if (!orderId) return;

    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/vnpay_return`, {
          params: Object.fromEntries(searchParams),
        });
        setResult(response.data);
      } catch (err) {
        setError(
          (err as AxiosError<{ message: string }>)?.response?.data?.message ||
            "Có lỗi xảy ra khi xử lý kết quả giao dịch."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [searchParams, orderId]);

  // Tra cứu đơn hàng dựa trên orderId
  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      try {
        const orderResponse = await axios.get(`${apiUrl}/get-ordersCode/${orderId}`);
        setOrderDetails(orderResponse.data);
      } catch (err) {
        console.error("Lỗi khi tra cứu đơn hàng:", err);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    if (!result || !orderDetails || !Gmail || notificationSentRef.current) return;

    const handleOrderProcessing = async () => {
      try {
        if (result?.code === "00") {
          await axios.put(`${apiUrl}/update-status/${orderDetails._id}`, { isPaid: true });
          await axios.post(`${apiUrl}/delete-cart`, { products: orderCart, userId: _id });

          queryClient.invalidateQueries({
            queryKey: ["CART"]
          });
          queryClient.invalidateQueries({
            queryKey: ["ORDER_HISTORY", _id],
          });

          // Gửi sự kiện socket khi đặt hàng thành công
          socket.emit("orderPlaced", {
            orderId: orderDetails._id,
            orderCode: orderDetails?.orderCode,
            userId: _id,
            status: "success",
            message: "Đặt hàng thành công!",
            productImage: orderCart?.[0]?.productItem?.image,
          });

          notificationSentRef.current = true;

          if (!emailSentRef.current) {
            // Gửi email xác nhận đơn hàng
            await sendOrderConfirmationEmail(Gmail, orderId);
            emailSentRef.current = true;
          }
        }

        if (result?.code === "24") {
          await axios.put(`${apiUrl}/delete-orderAdmin/${orderDetails._id}`);
          queryClient.invalidateQueries({
            queryKey: ["ORDER_HISTORY", _id],
          });
          toast({
            title: "Thanh toán thất bại!",
            description: "Đơn hàng đã bị hủy.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Lỗi khi xử lý đơn hàng:", error);
      }
    };

    handleOrderProcessing();
  }, [result, orderDetails, Gmail, orderCart, _id, apiUrl]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-600">
            Đang xử lý kết quả giao dịch, vui lòng chờ...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50">
        <div className="bg-red-100 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600">Lỗi giao dịch</h1>
          <p className="text-gray-700 mt-4">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      {result?.code === "00" ? (
        <div className="space-y-8 w-[900px] mx-auto text-center">
          <div className="bg-white p-6 shadow rounded-lg">
            <CheckCircle className="text-green-500 w-16 h-16 mb-4 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-800">Đặt hàng thành công!</h1>
            <p className="text-gray-600 mt-2">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn đang được xử lý!</p>
            <div className="mt-6 space-x-4">
              <Button onClick={() => navigate("/")} className="bg-green-500 text-white hover:bg-green-600">
                Về trang chủ
              </Button>
              <Button onClick={() => navigate("/users/order-history")} className="bg-blue-500 text-white hover:bg-blue-600">
                Xem lịch sử đơn hàng
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 2xl:w-[1408px] xl:w-[1200px] p-10 lg:w-[900px]  mx-auto flex justify-between items-center">
          <div className="bg-white p-6 shadow-[0_1px_2px_1px_rgba(0,0,0,0.1)] rounded-lg w-full text-center">
            <CircleX className="text-red-500 w-16 h-16 mb-4 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-800">
            Thanh toán thất bại!
            </h1>
            <p className="text-gray-600 mt-2">
              Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ để được trợ giúp.
            </p>

            <div className="mt-6 space-x-4">
              <Button
                variant="default"
                onClick={() => navigate("/")}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Về trang chủ
              </Button>
              {/* <Button
                variant="default"
                onClick={() => navigate("/users/order-history")}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Xem lịch sử đơn hàng
              </Button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentResult;
