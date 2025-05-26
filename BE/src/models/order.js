import mongoose from "mongoose";
import { nanoid } from "nanoid";
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  addressId: {
    type: Object,
    required: true, // Lưu thông tin chi tiết của địa chỉ
  },
  note: {
    type: String,
  },
  // Danh sách sản phẩm
  products: [Object],

  payment: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: [
      "chờ xác nhận",
      "đã xác nhận",
      "đang giao hàng",
      "đã hoàn thành",
      "hủy đơn",
    ],
    default: "chờ xác nhận",
  },
  // Trạng thái thanh toán (Boolean)
  isPaid: {
    type: Boolean,
    default: false, // Mặc định là chưa thanh toán (false)
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
  orderCode: {
    type: String,
    unique: true,
    required: true,
    default: () => nanoid(10), // Tạo mã đơn hàng với 10 ký tự ngẫu nhiên
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  statusHistory: [
    {
      status: { type: String, required: true }, // Trạng thái mới
      timestamp: { type: Date, default: Date.now }, // Thời gian thay đổi
      updatedBy: { type: String, default: "Hệ thống" }, // Người thực hiện cập nhật
    },
  ],
  cancellationReason: {
    type: String, // Lý do hủy đơn hàng
  },
  cancelledBy: {
    type: String, // Người thực hiện hủy đơn hàng
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
