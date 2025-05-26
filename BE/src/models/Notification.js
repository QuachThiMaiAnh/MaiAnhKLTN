import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: false, 
    },
    orderCode: {
      type: String,
      required: false, 
    },
    productImage: {
      type: String, // URL ảnh sản phẩm
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "error", "success"], // Các loại thông báo
      default: "info", // Mặc định là thông báo thông tin
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"], // Trạng thái của thông báo
      default: "pending", // Trạng thái mặc định
    },
    isRead: {
      type: Boolean,
      default: false, // Đánh dấu đã đọc hay chưa
    },
    isReadByAdmin: {
      type: Boolean,
      default: false, // Đánh dấu đã đọc hay chưa
    }
  },
  {
    timestamps: true, // Tự động thêm các trường createdAt, updatedAt
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
