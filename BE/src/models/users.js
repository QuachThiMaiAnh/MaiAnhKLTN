import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    // Thông tin định danh người dùng
    clerkId: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // Quản lý phân quyền & trạng thái
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // Thông tin bổ sung
    imageUrl: {
      type: String,
    },
    address: {
      type: String,
      default: "",
    },
    // Thông tin thanh toán (có thể mở rộng sau này)
    // paymentInfo: {
    //   type: String,
    //   default: "",
    // },
    phone: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Other"],
      default: "Other",
    },
    birthdate: {
      type: Date,
    },
    // Lịch sử đơn hàng (có thể mở rộng sau này)
    orders: [
      {
        orderId: {
          type: String,
          required: true,
        },
        orderDate: {
          type: Date,
          default: Date.now,
        },
        totalAmount: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["Completed", "Pending", "Cancelled"],
          default: "Pending",
        },
      },
    ],
  },
  {
    collection: "users",
    versionKey: false,
    timestamps: true,
  }
);

const Users = mongoose.model("Users", userSchema);
export default Users;
