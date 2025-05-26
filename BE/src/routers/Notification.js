import express from "express";
import {
  createNotification,
  deleteNotification,
  getAllNotifications,
  getNotifications,
  markAsRead,
  markAsReadByAdmin,
  unreadCount,
} from "../controllers/Notification";

const NotificationRouter = express.Router();

// Route tạo thông báo
NotificationRouter.post("/create", createNotification);

// Route lấy thông báo của một người dùng
NotificationRouter.get("/", getAllNotifications);
NotificationRouter.get("/:userId", getNotifications);
NotificationRouter.delete("/:id", deleteNotification);

// Route đánh dấu thông báo là đã đọc
NotificationRouter.patch("/mark-as-read/:id", markAsRead);
NotificationRouter.post("/mark-as-read-by-admin/:id", markAsReadByAdmin);
NotificationRouter.get("/unread-count/:userId", unreadCount);

export default NotificationRouter;
