import { useUserContext } from "@/common/context/UserProvider";
import useAddress from "@/common/hooks/address/useAddress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import EditAddress from "./EditAddress";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"; // Import các thành phần Dialog
import CreateAddress from "./CreatAddress";
import { deleteAddressByUserId, updateAddressByUserId } from "../services/address/Address";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export interface Address {
  _id?: string;
  userId: string | number;
  createdAt: string; 
  country: string;
  cityId: string | number;
  districtId: string | number;
  wardId: string | number;
  phone: string;
  addressDetail: string;
  email: string;
  name: string;
  isDefault?: boolean;
  addressId?: string | number;
}

const ListAddress = () => {
  const { _id } = useUserContext() ?? {}; // Lấy _id từ UserContext
  const { data, isLoading } = useAddress(_id); // Lấy danh sách địa chỉ từ hook useAddress
  const queryClient = useQueryClient();
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Quản lý trạng thái của dialog
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null); // Địa chỉ cần xóa

  const handleEditClick = (addressId: string) => {
    setSelectedAddressId(addressId); // Cập nhật addressId
  };

  const handleDeleteClick = (id: string) => {
    setAddressToDelete(id); // Lưu ID địa chỉ cần xóa
    setIsDialogOpen(true); // Mở dialog xác nhận
  };
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
  const confirmDelete = async () => {
    if (addressToDelete) {
      // Xử lý xóa địa chỉ ở đây (gọi API hoặc cập nhật DB)
     await deleteAddressByUserId(addressToDelete);
    queryClient.invalidateQueries({
      queryKey: ["ADDRESS_", _id]
    })
     toast({
      title: "Thành công!",
      description: "Xóa địa chỉ thành công.",
      variant: "default",
    });
    }
    setIsDialogOpen(false); // Đóng dialog sau khi xóa
    setAddressToDelete(null); // Xóa địa chỉ đã chọn
  };

  const cancelDelete = () => {
    setIsDialogOpen(false); // Đóng dialog nếu huỷ
    setAddressToDelete(null); // Xóa địa chỉ đã chọn
  };
  const sortedAddresses = data?.sort((a : Address, b : Address) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
  return (
    <div className="container p-5">
      {/* Địa chỉ của tôi */}
      <div className="flex justify-between border-b items-center">
        <h3 className="text-2xl font-medium mb-8 text-gray-800 mt-5">Địa chỉ của tôi</h3>
        <div className="flex items-center px-4 text-white bg-[#b8cd06] gap-2">
          <svg enableBackground="new 0 0 10 10" viewBox="0 0 10 10" x={0} y={0} className="shopee-svg-icon w-[14px] icon-plus-sign" style={{ color: "#fff", fill: "white" }}>
            <polygon points="10 4.5 5.5 4.5 5.5 0 4.5 0 4.5 4.5 0 4.5 0 5.5 4.5 5.5 4.5 10 5.5 10 5.5 5.5 10 5.5" />
          </svg>
          <CreateAddress/>
        </div>
      </div>
      {/* end Địa chỉ của tôi */}

      <div>
        <h3 className="text-2xl font-medium mb-1 text-gray-800 mt-5">Địa chỉ</h3>

        {/* Hiển thị Skeleton khi đang loading */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-[116px] w-full" />
            <Skeleton className="h-[116px] w-full" />
          </div>
        ) : (
          <div>
            {/* Hiển thị danh sách địa chỉ nếu có dữ liệu */}
            {sortedAddresses && sortedAddresses.length > 0 ? (
              sortedAddresses.map((address: Address, index: string) => (
                <div key={index} className="flex py-5 border-b justify-between">
                  <div>
                    <div className="flex mb-1 items-center gap-2">
                      <h2 className="text-xl font-medium text-gray-800">{address.name}</h2>
                      <span className="text-[rgba(0,0,0,0.54)]">| {address.phone}</span>
                    </div>
                    <p className="text-[rgba(0,0,0,0.54)]">{address.addressDetail}</p>
                    <p className="text-[rgba(0,0,0,0.54)]">{address.wardId}, {address.districtId}, {address.cityId}</p>
                    {address.isDefault && (
                      <div className="mt-3">
                        <span className="border px-5 bg-[#b8cd06] text-white py-2">Mặc định</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      {!address.isDefault && (
                        <div className="text-blue-500 float-right cursor-pointer mb-4" onClick={() => address._id && handleDeleteClick(address._id)}>
                          Xóa
                        </div>
                      )}
                      <Link to={``} className="text-blue-500 float-right mb-4" onClick={() => address._id && handleEditClick(address._id)}>
                        <EditAddress addressId={selectedAddressId} />
                      </Link>
                    </div>
                    <Button onClick={() => handledefault(address)}>Thiết lập mặc định</Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[red] text-xl h-44 flex justify-center items-center">Chưa có địa chỉ nào.</p>
            )}
          </div>
        )}
      </div>

      {/* Modal xác nhận xóa */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa địa chỉ này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={cancelDelete}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListAddress;
