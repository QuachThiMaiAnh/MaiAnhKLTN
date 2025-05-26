import { useUserContext } from "@/common/context/UserProvider";
import useAddress from "@/common/hooks/address/useAddress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react"; // Sử dụng useState và useEffect để quản lý địa chỉ đã chọn
import EditAddress from "../../address/EditAddress";
import { updateAddressByUserId } from "../../services/address/Address";
import { toast } from "@/components/ui/use-toast";
import { Address } from "../../address/ListAddress";
import { useQueryClient } from "@tanstack/react-query";
import CreateAddress from "../../address/CreatAddress";

interface AddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddressDialog = ({ isOpen, onClose }: AddressDialogProps) => {
  const queryClient = useQueryClient();
  const { _id } = useUserContext() ?? {}; // Lấy _id từ UserContext
  const { data, isLoading, error } = useAddress(_id); // Lấy danh sách địa chỉ từ hook useAddress
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null); // State để lưu địa chỉ đã chọn

  // Cập nhật địa chỉ mặc định khi có dữ liệu
  useEffect(() => {
    if (data) {
      const defaultAddress = data.find((address: Address) => address.isDefault); // Tìm địa chỉ mặc định
      if (defaultAddress) {
        setSelectedAddress(defaultAddress); // Cập nhật địa chỉ mặc định vào state
      }
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>; // Hiển thị thông báo khi đang tải dữ liệu
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Hiển thị lỗi nếu có
  }

  const handledefault = async(address : Address) => {
    await updateAddressByUserId({
      ...address, isDefault: true,
      addressId: address._id
    });
    queryClient.invalidateQueries({
      queryKey: ["ADDRESS_", address]
    })
    toast({
      title: "Thành công!",
      description: "đã đặt địa chỉ làm mặc định.",
      variant: "default",
    });
  }
  const sortedData = data?.sort((a : Address, b : Address) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1 text-[24px]">Danh sách địa chỉ</DialogTitle>
          <CreateAddress/>
        </DialogHeader>
        <div className="space-y-4">
          {/* Danh sách địa chỉ */}
          <ul className="space-y-2">
            {sortedData?.map((address: Address) => (
              <li
                key={address._id} // Sử dụng _id làm key để đảm bảo tính duy nhất
                className="border p-2 rounded flex justify-between items-center"
              >
                <div className="flex  space-x-2">
                  {/* Radio button để chọn địa chỉ */}
                  <input
                    type="radio"
                    name="address"
                    value={address._id}
                    checked={selectedAddress?._id === address._id || address.isDefault} // Kiểm tra nếu là địa chỉ mặc định
                    onChange={() => handledefault(address)} // Chỉ cập nhật khi chọn radio
                    className="h-4 w-4 mt-[2%]"
                  />
                  <div
                    className="cursor-pointer"
                    onClick={() => handledefault(address)} // Chỉ cập nhật khi click vào phần địa chỉ
                  >
                    <div className="flex mb-1 items-center gap-2">
                      <h2 className="text-xl font-medium text-gray-800">{address.name}</h2>
                      <span className="text-[rgba(0,0,0,0.54)]">| {address.phone}</span>
                    </div>
                    <p className="text-[rgba(0,0,0,0.54)]">{address.addressDetail}</p>
                    <p className="text-[rgba(0,0,0,0.54)]">{address.wardId}, {address.districtId}, {address.cityId}</p>
                  </div>
                </div>
                <EditAddress addressId={address._id}/>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddressDialog;
