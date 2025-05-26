import { getAddressById, getAllAddressUserById } from "@/pages/(website)/services/address/Address";
import { useQuery } from "@tanstack/react-query";

// Hàm UseCountry nhận cả userId và addressId
const useAddress = (userId?: number | string | undefined, addressId?: string) => {
  // Sử dụng React Query để lấy dữ liệu
  const { data, ...rest } = useQuery({
    queryKey: ["ADDRESS_", userId, addressId], // Cập nhật key để gồm cả userId và addressId
    queryFn: async () => {
      if (userId) {
        return await getAllAddressUserById(userId);  // Nếu có userId, lấy dữ liệu theo userId
      } else if (addressId) {
        return await getAddressById(addressId);  // Nếu không có userId, lấy dữ liệu theo addressId
      }
      throw new Error("Cả userId và addressId đều không hợp lệ.");  // Xử lý trường hợp không có tham số hợp lệ
    },
  });

  return { data, ...rest };
};

export default useAddress;
