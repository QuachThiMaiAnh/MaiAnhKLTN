import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import Country from "../cart/_components/Country";
import { Textarea } from "@/components/ui/textarea";
import useAddress from "@/common/hooks/address/useAddress";
import { updateAddressByUserId } from "../services/address/Address";
import { useQueryClient } from "@tanstack/react-query";
interface EditAddressProps {
    addressId: string | undefined; // Nhận addressId từ props
  }
const EditAddress = ({ addressId }: EditAddressProps) => {
  const { data } = useAddress( undefined,addressId);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");
  useEffect(() => {
    if (data) {
      setName(data.name);
      setPhone(data.phone);
      setCity(data.cityId);
      setDistrict(data.districtId);
      setWard(data.wardId);
      setAddress(data.addressDetail);
    }
  }, [data]);
  const handleCityChange = (cityName: string) => {
    setCity(cityName);
  };

  const handleDistrictChange = (districtName: string) => {
    setDistrict(districtName);
  };

  const handleWardChange = (wardName: string) => {
    setWard(wardName);
  };
const country = "Việt Nam"
  const handleSave = async() => {
    // Kiểm tra các trường không trống
    if (!name || !phone || !city || !district || !ward || !address) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng điền đầy đủ thông tin.",
        variant: "destructive",
      });
      return;
    }
     // Kiểm tra các trường không trống và không chỉ có dấu cách
     if (
      !name.trim() ||
      !phone.trim() ||
      !city.trim() ||
      !district.trim() ||
      !ward.trim() ||
      !address.trim()
    ) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng điền đầy đủ thông tin hợp lệ, không chỉ chứa dấu cách.",
        variant: "destructive",
      });
      return;
    }

    // Kiểm tra số điện thoại hợp lệ
    const phonePattern = /^[0-9]{10,11}$/; // Kiểm tra số điện thoại có đúng định dạng
    if (!phonePattern.test(phone)) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng nhập số điện thoại hợp lệ.",
        variant: "destructive",
      });
      return;
    }
    const updateAddress = {
      name, phone, cityId: city, districtId:district, wardId:ward, addressDetail: address, country,
      userId : data.userId,
      addressId: data._id,
    }
    await updateAddressByUserId(updateAddress);
    queryClient.invalidateQueries({
      queryKey: ["ADDRESS_", addressId]
    })

    console.log("Saved information:", updateAddress);

    toast({
      title: "Thành công!",
      description: "Cập nhật địa chỉ thành công.",
      variant: "default",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Cập nhật</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật địa chỉ</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Họ và tên
            </Label>
            <Input
              id="name"
              placeholder="họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
              style={{margin: 0}}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              value={phone}
              placeholder="số điện thoại"
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
              required
              pattern="^[0-9]{10,11}$"
              title="Số điện thoại phải có từ 10 đến 11 chữ số"
              style={{margin: 0}}
            />
          </div>

          {/* Tỉnh thành, quận huyện, xã */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tỉnh Thành</Label>
            <div className="col-span-3">
              <Country
                onCityChange={handleCityChange}
                onDistrictChange={handleDistrictChange}
                onWardChange={handleWardChange}
                city={city} // Truyền tỉnh thành đã chọn
                district={district} // Truyền quận huyện đã chọn
                ward={ward} // Truyền phường xã đã chọn
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="addressDetail" className="text-right">
              Địa chỉ
            </Label>
            <Textarea
              id="addressDetail"
              placeholder="Địa chỉ cụ thể"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAddress