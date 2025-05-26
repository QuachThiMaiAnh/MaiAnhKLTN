import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import Country from "../cart/_components/Country";
import { Textarea } from "@/components/ui/textarea";
import { useUserContext } from "@/common/context/UserProvider";
import { createAddress } from "../services/address/Address";
import { useQueryClient } from "@tanstack/react-query";

const CreateAddress = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const queryClient = useQueryClient();
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");
  const { _id } = useUserContext() ?? {}; // Lấy _id từ UserContext
  const handleCityChange = (cityName: string) => {
    setCity(cityName);
  };

  const handleDistrictChange = (districtName: string) => {
    setDistrict(districtName);
  };

  const handleWardChange = (wardName: string) => {
    setWard(wardName);
  };

  const handleSave = async () => {
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
        description:
          "Vui lòng điền đầy đủ thông tin hợp lệ, không chỉ chứa dấu cách.",
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
    const country = "Việt Nam";

    const CreateAddress = {
      name,
      phone,
      cityId: city,
      districtId: district,
      wardId: ward,
      addressDetail: address,
      country,
      userId: _id,
    };
    try {
      await createAddress(CreateAddress);
      setName("");
      setPhone("");
      setCity("");
      setDistrict("");
      setWard("");
      setAddress("");
      queryClient.invalidateQueries({
        queryKey: ["ADDRESS_", _id]
      })
      toast({
        title: "Thành công!",
        description: "Thêm địa chỉ thành công.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        title: "Lỗi!",
        description: "Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className="text-[18px] add font-medium text-white "
          style={{ backgroundColor: "#b8cd06", border: 0 }}
        >
          Thêm địa chỉ mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm địa chỉ mới</DialogTitle>
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
              style={{ margin: 0 }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              placeholder="số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
              required
              pattern="^[0-9]{10,11}$"
              title="Số điện thoại phải có từ 10 đến 11 chữ số"
              style={{ margin: 0 }}
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
                ward={ward}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Địa chỉ
            </Label>
            <Textarea
              id="address"
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

export default CreateAddress;
