import { getAllOrders } from "@/pages/(website)/services/OrderHistory/Order";
import { useQuery } from "@tanstack/react-query";

// Hook để lấy tất cả đơn hàng
const useAllOrders = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["ORDER_HISTORY"], // Key cho query này
    queryFn: async () => {
      return await getAllOrders(); // Lấy tất cả đơn hàng
    },
    enabled: true, // Luôn kích hoạt query
  });

  return { data, ...rest };
};

export default useAllOrders;
