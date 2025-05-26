import { Alert } from "@/components/ui/alert";
import axios, { AxiosError } from "axios";

 interface Address {
  userId: string | number | undefined;
  country: string;
  cityId: string | number;
  districtId: string | number;
  wardId: string | number;
  phone: string;
  addressDetail: string;
  email?: string;
  name: string;
  isDefault?: boolean;
  addressId?: string | number;
}
const apiUrl = import.meta.env.VITE_API_URL;
// Lấy tất cả địa chỉ của người dùng theo userId
export const getAllAddressUserById = async (userId: string | number) => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-address/${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return <Alert variant="destructive">Lỗi khi lấy danh sách địa chỉ</Alert>;  // Dùng destructive thay vì danger
  }
};

// Lấy thông tin địa chỉ theo addressId
export const getAddressById = async (addressId: string | number) => {
  try {
    const response = await axios.get(`${apiUrl}/get-address/${addressId}`);
    return response.data.address;
  } catch (error) {
    console.log(error);
    return <Alert variant="destructive">Lỗi khi lấy thông tin địa chỉ</Alert>;  // Dùng destructive thay vì danger
  }
};

// Thêm địa chỉ mới cho người dùng
export const createAddress = async (address: Address) => {
  try {
    const response = await axios.post(`${apiUrl}/create-address`, address);
      <Alert variant="default">Tạo địa chỉ thành công!</Alert>  // Dùng default cho thông báo thành công
      return response.data;
   
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      return <Alert variant="destructive">{error.response.data.message}</Alert>;  // Dùng destructive cho thông báo lỗi
    } else {
      return <Alert variant="destructive">Có lỗi xảy ra. Vui lòng thử lại!</Alert>;  // Dùng destructive cho thông báo lỗi chung
    }
  }
};

// Cập nhật địa chỉ dựa trên addressId
export const updateAddressByUserId = async (address: Address) => {
  try {
    const response = await axios.put(`${apiUrl}/update-address/${address.addressId}`, address);
   
      <Alert variant="default">Cập nhật địa chỉ thành công!</Alert>  // Dùng default cho thông báo thành công
      return response.data;
   
  } catch (error) {
    console.log(error);
    return <Alert variant="destructive">Lỗi khi cập nhật địa chỉ</Alert>;  // Dùng destructive cho thông báo lỗi
  }
};

// Xóa địa chỉ theo addressId
export const deleteAddressByUserId = async (addressId: string | number) => {
  try {
    const response = await axios.delete(`${apiUrl}/delete-addresses/${addressId}`);
    
      <Alert variant="default">Xóa địa chỉ thành công!</Alert>  // Dùng default cho thông báo thành công
      return response.data;
   
  } catch (error) {
    console.log(error);
    return <Alert variant="destructive">Lỗi khi xóa địa chỉ</Alert>;  // Dùng destructive cho thông báo lỗi
  }
};

// Xóa nhiều địa chỉ theo addressIds
export const deleteManyAddresses = async (addressIds: (string | number)[]) => {
  try {
    const response = await axios.delete(`${apiUrl}/address/delete-many`, {
      data: { addressIds },  // Truyền danh sách addressIds vào body của request
    });
      <Alert variant="default">Xóa nhiều địa chỉ thành công!</Alert>  // Dùng default cho thông báo thành công
    return response.data;
  } catch (error) {
    console.log(error);
    return <Alert variant="destructive">Lỗi khi xóa nhiều địa chỉ</Alert>;  // Dùng destructive cho thông báo lỗi
  }
};
