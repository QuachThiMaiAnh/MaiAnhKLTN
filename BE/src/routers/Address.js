import { Router } from "express";
import {
  createAddress,
  deleteAddressByUserId,
  getAddressById,
  getAllAddressUserById,
  updateAddressByUserId,
} from "../controllers/address";

const routerAddress = Router();
// Tạo địa chỉ mới
routerAddress.post("/create-address", createAddress);
// Lấy địa chỉ theo userId
routerAddress.get("/get-all-address/:userId", getAllAddressUserById);
// Lấy địa chỉ theo  id addressId
routerAddress.get("/get-address/:addressId", getAddressById);
// Cập nhật địa chỉ theo userId
routerAddress.put("/update-address/:addressId", updateAddressByUserId);
// Xóa địa chỉ theo userId
routerAddress.delete("/delete-addresses/:addressId", deleteAddressByUserId);

export default routerAddress;
