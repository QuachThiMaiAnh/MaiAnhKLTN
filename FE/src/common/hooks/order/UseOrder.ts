// import { getAllOrders, getAllOrdersByUsesId, getOrderById } from "@/pages/(website)/services/OrderHistory/Order";
// import { useQuery } from "@tanstack/react-query";

// // Hàm UseCountry nhận cả userId và addressId
// const useOrder = (userId?: string , orderId?: string) => {
//   // Sử dụng React Query để lấy dữ liệu
//   const { data, ...rest } = useQuery({
//     queryKey: ["ORDER_HISTORY", userId, orderId], // Cập nhật key để gồm cả userId và addressId
//     queryFn: async () => {
//       if (userId) {
//         return await getAllOrdersByUsesId(userId);  // Nếu có userId, lấy dữ liệu theo userId
//       } else if (orderId) {
//         return await getOrderById(orderId);  // Nếu không có userId, lấy dữ liệu theo addressId
//       }
//       throw new Error("Cả userId và addressId đều không hợp lệ.");  // Xử lý trường hợp không có tham số hợp lệ
//     },
//   });

//   return { data, ...rest };
// };

// export default useOrder;
import {  getAllOrdersByUsesId, getOrderById } from "@/pages/(website)/services/OrderHistory/Order";
import { useQuery } from "@tanstack/react-query";

const useOrder = (userId?: string, orderId?: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ["ORDER_HISTORY", userId, orderId], // Gồm cả userId và orderId nếu có
    queryFn: async () => {
      if (userId) {
        return await getAllOrdersByUsesId(userId); // Lấy theo userId
      }
      if (orderId) {
        return await getOrderById(orderId); // Lấy theo orderId
      }
    },
    enabled: true, // Luôn kích hoạt query
  });

  return { data, ...rest };
};

export default useOrder;
