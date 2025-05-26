import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button"; // Shadcn UI button component
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 2xl:w-[1408px] xl:w-[1200px] p-10 lg:w-[900px]  mx-auto flex justify-between items-center">
      <div className="bg-white p-6 shadow-[0_1px_2px_1px_rgba(0,0,0,0.1)] rounded-lg w-full text-center">
        <CheckCircle className="text-green-500 w-16 h-16 mb-4 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mt-2">
          Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn đang được xử lý!
        </p>

        <div className="mt-6 space-x-4">
          <Button
            variant="default"
            onClick={() => navigate("/")}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            Về trang chủ
          </Button>
          <Button
            variant="default"
            onClick={() => navigate("/users/order-history")}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Xem lịch sử đơn hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
