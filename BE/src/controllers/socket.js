import { Server } from "socket.io";
import Notification from "../models/Notification";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import Users from "../models/users.js";

// Cấu hình và xử lý các sự kiện Socket.IO
let io;

export const setupSocketIO = (server, app) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client đã kết nối:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
      if (userSocketMap[userId] && userSocketMap[userId] !== socket.id) {
        console.log(`Đóng kết nối socket cũ cho user: ${userId}`);
        const oldSocketId = userSocketMap[userId];
        io.sockets.sockets.get(oldSocketId)?.disconnect();
      }
      userSocketMap[userId] = socket.id; // Cập nhật socket ID mới
      console.log("Người dùng đã kết nối:", userId);
    }

    // Lắng nghe sự kiện join_room
    socket.on("join_room", async (userId) => {
      const rooms = Object.keys(socket.rooms);
      if (!rooms.includes(userId)) {
        // Rời khỏi các phòng trước đó để tránh nhận trùng lặp
        rooms.forEach((room) => {
          if (room !== socket.id) socket.leave(room);
        });

        socket.join(userId);
        console.log(`Admin ${userId} đã tham gia phòng:`, userId);

        // Cập nhật socket ID duy nhất cho admin
        userSocketMap[userId] = socket.id;
      }
    });

    // Lắng nghe sự kiện 'orderPlaced' từ client
    // socket.on("orderPlaced", async (orderData) => {
    //   // console.log("Đơn hàng được đặt:", orderData);

    //   try {
    //     const { userId, orderCode, orderId, productName, productImage } =
    //       orderData;

    //     // Tạo thông báo dành cho user
    //     const userMessage = `Đơn hàng với mã <strong>${orderCode}</strong> đã được đặt thành công!`;

    //     // Gửi thông báo cho user
    //     io.to(userId).emit("orderNotification", {
    //       userId,
    //       message: userMessage,
    //       orderCode,
    //       orderId,
    //       productImage: productImage || null,
    //       productName,
    //       isRead: false,
    //       createdAt: new Date(),
    //     });

    //     console.log("Thông báo đặt hàng đã gửi cho user:", userId);

    //     // Tạo thông báo dành cho admin
    //     const adminMessage = `Người dùng <strong>${userId}</strong> đã đặt đơn hàng với mã <strong>${orderCode}</strong>.`;

    //     // Gửi thông báo cho tất cả admin
    //     const adminIds = await Users.find({ role: "Admin" }).select("_id");
    //     adminIds.forEach((admin) => {
    //       const adminId = admin._id.toString();

    //       io.to(adminId).emit("adminOrderPlacedNotification", {
    //         userId,
    //         message: adminMessage,
    //         orderCode,
    //         orderId,
    //         productImage: productImage || null,
    //         productName,
    //         isRead: false,
    //         createdAt: new Date(),
    //       });

    //       console.log("Thông báo đặt hàng đã gửi cho admin:", adminId);
    //     });

    //     // Lưu thông báo vào database (tùy theo yêu cầu)
    //     const newNotification = new Notification({
    //       userId,
    //       orderCode,
    //       orderId,
    //       message: userMessage,
    //       productImage,
    //       productName,
    //       type: "info",
    //       status: "success",
    //       isRead: false,
    //       timestamp: new Date(),
    //     });

    //     await newNotification.save(); // Lưu vào database
    //     console.log("Thông báo đã được lưu vào database.");
    //   } catch (error) {
    //     console.error("Lỗi khi xử lý orderPlaced:", error);

    //     // Gửi lỗi đến user nếu lưu thông báo thất bại
    //     io.to(orderData.userId).emit("orderNotificationError", {
    //       error: "Không thể xử lý thông báo đặt hàng. Vui lòng thử lại.",
    //     });
    //   }
    // });

    socket.on("orderPlaced", async (orderData) => {
      try {
        const { userId, orderCode, orderId, productName, productImage } =
          orderData;

        const userMessage = `Đơn hàng với mã <strong>${orderCode}</strong> đã được đặt thành công!`;

        // 👉 Lưu thông báo vào database trước
        const savedNotification = await new Notification({
          userId,
          orderCode,
          orderId,
          message: userMessage,
          productImage,
          productName,
          type: "info",
          status: "success",
          isRead: false,
          timestamp: new Date(),
        }).save();

        // ✅ Emit đầy đủ notification (CÓ _id)
        io.to(userId).emit("orderNotification", savedNotification);

        console.log("Thông báo đặt hàng đã gửi cho user:", userId);

        // Gửi cho admin
        const adminMessage = `Người dùng <strong>${userId}</strong> đã đặt đơn hàng với mã <strong>${orderCode}</strong>.`;

        const adminIds = await Users.find({ role: "Admin" }).select("_id");
        adminIds.forEach((admin) => {
          io.to(admin._id.toString()).emit("adminOrderPlacedNotification", {
            userId,
            message: adminMessage,
            orderCode,
            orderId,
            productImage,
            productName,
            isRead: false,
            createdAt: new Date(),
          });
        });
      } catch (error) {
        console.error("Lỗi khi xử lý orderPlaced:", error);
        io.to(orderData.userId).emit("orderNotificationError", {
          error: "Không thể xử lý thông báo đặt hàng. Vui lòng thử lại.",
        });
      }
    });

    // Lắng nghe sự kiện 'orderStatusChanged'
    // socket.on("orderStatusChanged", async (data) => {
    //   // console.log("Trạng thái đơn hàng đã thay đổi:", data);

    //   try {
    //     const {
    //       orderCode,
    //       newStatus,
    //       userId,
    //       productImage,
    //       productName,
    //       orderId,
    //     } = data;

    //     const message = `Đơn hàng với mã <strong>${orderCode}</strong> đã được cập nhật và chuyển sang trạng thái <strong>${newStatus}</strong>.`;

    //     const userIdStr =
    //       typeof userId === "object" && userId._id
    //         ? userId._id.toString()
    //         : userId;

    //     // Lưu thông báo vào database
    //     const newNotification = new Notification({
    //       userId: userIdStr,
    //       orderCode,
    //       orderId,
    //       productImage,
    //       productName,
    //       message,
    //       type: "info", // Loại thông báo
    //       status:
    //         newStatus === "đã hoàn thành" || newStatus === "hủy đơn"
    //           ? "success"
    //           : "pending", // Trạng thái thông báo
    //       isRead: false, // Chưa đọc
    //       timestamp: new Date(),
    //     });

    //     await newNotification.save(); // Lưu vào database
    //     console.log("Thông báo đã được lưu vào database.");

    //     // Phát thông báo cho phòng của người dùng
    //     io.to(userIdStr).emit("orderStatusNotification", {
    //       userId: newNotification.userId,
    //       message: newNotification.message,
    //       orderCode: newNotification.orderCode,
    //       orderId: newNotification.orderId,
    //       productImage: newNotification.productImage || null,
    //       productName: newNotification.productName,
    //       isRead: newNotification.isRead,
    //       createdAt: newNotification.createdAt,
    //     });

    //     console.log("đã phát thông báo cho", userIdStr);

    //     // Lưu thông báo cho admin
    //     const adminMessage = `Đơn hàng với mã <strong>${orderCode}</strong> đã được cập nhật và chuyển sang trạng thái <strong>${newStatus}</strong>.`;

    //     const adminIds = await Users.find({ role: "Admin" }).select("_id");
    //     adminIds.forEach((admin) => {
    //       const adminIdStr = admin._id.toString();
    //       io.to(adminIdStr).emit("adminOrderStatusNotification", {
    //         userId: userIdStr,
    //         message: adminMessage,
    //         orderCode,
    //         orderId,
    //         productImage: productImage || null,
    //         productName,
    //         isRead: false,
    //         createdAt: new Date(),
    //       });
    //       console.log("Đã phát thông báo cho admin:", adminIdStr);
    //     });
    //   } catch (error) {
    //     console.error("Lỗi khi lưu thông báo về trạng thái đơn hàng:", error);
    //     io.to(userId).emit("orderStatusNotificationError", {
    //       error: "Không thể lưu thông báo trạng thái. Vui lòng thử lại.",
    //     });
    //   }
    // });

    socket.on("orderStatusChanged", async (data) => {
      try {
        const {
          orderCode,
          newStatus,
          userId,
          productImage,
          productName,
          orderId,
        } = data;

        const userIdStr =
          typeof userId === "object" && userId._id
            ? userId._id.toString()
            : userId;

        const message = `Đơn hàng với mã <strong>${orderCode}</strong> đã được cập nhật và chuyển sang trạng thái <strong>${newStatus}</strong>.`;

        // 👉 Lưu thông báo trước
        const savedNotification = await new Notification({
          userId: userIdStr,
          orderCode,
          orderId,
          productImage,
          productName,
          message,
          type: "info",
          status:
            newStatus === "đã hoàn thành" || newStatus === "hủy đơn"
              ? "success"
              : "pending",
          isRead: false,
          timestamp: new Date(),
        }).save();

        // ✅ Emit CÓ _id về cho người dùng
        io.to(userIdStr).emit("orderStatusNotification", savedNotification);

        console.log("Đã phát thông báo cho user:", userIdStr);

        const adminMessage = `Đơn hàng với mã <strong>${orderCode}</strong> đã được cập nhật và chuyển sang trạng thái <strong>${newStatus}</strong>.`;

        const adminIds = await Users.find({ role: "Admin" }).select("_id");
        adminIds.forEach((admin) => {
          io.to(admin._id.toString()).emit("adminOrderStatusNotification", {
            userId: userIdStr,
            message: adminMessage,
            orderCode,
            orderId,
            productImage,
            productName,
            isRead: false,
            createdAt: new Date(),
          });
        });
      } catch (error) {
        console.error("Lỗi khi xử lý orderStatusChanged:", error);
        io.to(userId).emit("orderStatusNotificationError", {
          error: "Không thể lưu thông báo trạng thái. Vui lòng thử lại.",
        });
      }
    });

    // Lắng nghe sự kiện ngắt kết nối
    socket.on("sendAdminMessage", async ({ conversationId, text, adminId }) => {
      console.log("Tin nhắn từ admin:");
      // try {
      //   // Tìm cuộc trò chuyện
      //   const conversation = await Conversation.findById(conversationId);
      //   if (!conversation) {
      //     return socket.emit("error", { error: "Conversation not found" });
      //   }
      //   // Tạo tin nhắn
      //   const message = await Message.create({
      //     conversationId: conversation._id,
      //     sender: adminId,
      //     senderType: "Admin",
      //     text,
      //   });
      //   conversation.messages.push(message._id);
      //   await conversation.save();
      //   // Gửi tin nhắn đến user
      //   socket
      //     .to(conversation.user.toString())
      //     .emit("receiveMessage", { message });
      // } catch (error) {
      //   console.error(error);
      //   socket.emit("error", { error: "Internal Server Error" });
      // }
    });
    // socket.on("sendAdminMessage", async ({ conversationId, text, adminId }) => {
    //   console.log("Tin nhắn từ admin:");
    //   try {
    //     // Tìm cuộc trò chuyện
    //     const conversation = await Conversation.findById(conversationId);
    //     if (!conversation) {
    //       return socket.emit("error", { error: "Conversation not found" });
    //     }
    //     // Tạo tin nhắn
    //     const message = await Message.create({
    //       conversationId: conversation._id,
    //       sender: adminId,
    //       senderType: "Admin",
    //       text,
    //     });
    //     conversation.messages.push(message._id);
    //     await conversation.save();
    //     // Gửi tin nhắn đến user
    //     socket
    //       .to(conversation.user.toString())
    //       .emit("receiveMessage", { message });
    //   } catch (error) {
    //     console.error(error);
    //     socket.emit("error", { error: "Internal Server Error" });
    //   }
    // });

    // socket.on("newMessage", async ({ conversationId, text, userId }) => {
    //   console.log("Tin nhắn từ user:");
    //   io.emit("messageSent", { message: "Message sent" });
    //   try {
    //     let conversation = await Conversation.findOne({ user: userId });
    //     // socket.emit("messageSent", { message: "Message sent" });
    //     if (!conversation) {
    //       const admins = await Users.find({ role: "Admin" }).select("_id");
    //       conversation = await Conversation.create({
    //         user: userId,
    //         admins: admins.map((admin) => admin._id),
    //       });
    //     }
    //     const message = await Message.create({
    //       conversationId: conversation._id || conversationId,
    //       sender: userId,
    //       senderType: "User",
    //       text,
    //     });
    //     conversation.messages.push(message._id);
    //     conversation.updatedAt = Date.now();
    //     await conversation.save();
    //     // Phát tin nhắn đến tất cả admin đang trực tuyến
    //     const adminIds = conversation.admins.map((admin) => admin.toString());
    //     for (const adminId of adminIds) {
    //       io.to(adminId).emit("receiveMessage", { message });
    //     }
    //     return io.emit("messageSent", { message });
    //   } catch (error) {
    //     console.error("Error:", error);
    //     socket.emit("error", { error: "Internal Server Error" });
    //   }
    // });

    socket.on("setup", (userData) => {
      console.log("User connected: ", userData);
      socket.join(userData);

      socket.emit("connected");
    });

    socket.on("joinChat", (room) => {
      socket.join(room);
      console.log("User joined Room", room);
    });

    // socket.on("messageRecieved", (newMessageRecieved) => {
    //   console.log("newMessageRecieved:", newMessageRecieved);
    // });

    socket.on("newMessage", (newMessageRecieved) => {
      console.log("LUONG:");
      if (!newMessageRecieved.sender.listUsers)
        return console.log("Khong co conversation.listUsers");

      const uniqueUsers = [...new Set(newMessageRecieved.sender.listUsers)];

      // socket.emit("agh", newMessageRecieved);

      uniqueUsers.forEach((user) => {
        if (user == newMessageRecieved.sender._id) return;
        console.log(`Notifying user ${user} about the message.`);
        socket.to(user).emit("messageRecieved", newMessageRecieved);
      });
    });

    // Xử lý sự kiện ngắt kết nối
    socket.on("disconnect", () => {
      delete userSocketMap[userId]; // Xóa socket id khi người dùng ngắt kết nối
    });
  });

  // Gán io vào app để có thể sử dụng trong controller
  app.set("io", io);
};

const userSocketMap = {};

// Hàm tìm socketId của người nhận
export function getReceiverSocketId(conversationId) {
  console.log(userSocketMap);
  return userSocketMap[conversationId];
}

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io chưa được khởi tạo!");
  }
  return io; // Trả về đối tượng io để sử dụng trong file khác
};
