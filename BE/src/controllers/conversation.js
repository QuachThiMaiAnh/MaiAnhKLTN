import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import User from "../models/users.js";
import { getReceiverSocketId } from "./socket.js";

export const getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({})
      .populate("user", "firstName lastName imageUrl") // Lấy thông tin user
      .select("_id user updatedAt") // Chỉ lấy các trường cần thiết
      .sort({ updatedAt: -1 });

    if (!conversations) {
      return res.status(400).json({ error: "Không tìm thấy cuộc trò chuyện" });
    }

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Không tìm thấy cuộc trò chuyện" });
  }
};

export const sendMessageFromAdmin = async (req, res) => {
  const { conversationId } = req.params;
  const { adminId, text } = req.body;

  // console.log("RECEIVER ID : ", receiverId);

  try {
    // Kiểm tra xem cuộc trò chuyện có tồn tại không
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Không tìm thấy cuộc trò chuyện." });
    }

    const user = await User.findById(adminId);

    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng." });
    }

    const { role, _id, imageUrl, firstName, lastName } = user;

    // Tạo tin nhắn mới
    const message = await Message.create({
      conversationId,
      sender: adminId,
      senderType: "Admin",
      text,
    });

    // Cập nhật cuộc trò chuyện
    conversation.messages.push(message._id);
    // conversation.admins.push(adminId);
    conversation.updatedAt = Date.now();

    if (conversation.admins.indexOf(adminId) === -1) {
      conversation.admins.push(adminId);
    }

    await conversation.save();

    // console.log(conversation);

    const result = {
      ...message._doc,
      sender: {
        _id,
        imageUrl,
        listUsers: [conversation.user, ...conversation.admins],
        firstName,
        lastName,
        role,
      },
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessageFromUser = async (req, res) => {
  const { userId } = req.params;
  const { text, conversationId } = req.body;

  if (!text || !userId) {
    return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "Gửi tin nhắn không thành công" });
    }

    let conversation = await Conversation.findOne({ _id: conversationId });

    if (!conversation) {
      conversation = await Conversation.create({
        user: userId,
        admins: [],
      });
    }

    const allAdmin = await User.find({ role: "Admin" });

    conversation.admins = allAdmin.map((admin) => admin._id);

    const { role, _id, imageUrl, firstName, lastName } = user;

    const message = await Message.create({
      conversationId: conversation._id,
      sender: userId,
      senderType: "User",
      text,
    });

    conversation.messages.push(message._id);
    conversation.updatedAt = Date.now();

    await conversation.save();

    const result = {
      ...message._doc,
      sender: {
        _id,
        imageUrl,
        listUsers: [conversation.user, ...conversation.admins],
        firstName,
        lastName,
        role,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getConversation = async (req, res) => {
  const { userId } = req.params;

  try {
    // Lấy cuộc trò chuyện dựa trên userId và populate admins + messages
    const conversation = await Conversation.findOne({ user: userId })
      .populate("admins", "name") // Lấy tên của admin
      .populate({
        path: "messages", // Lấy messages
        select: "text sender senderType createdAt", // Chỉ lấy các trường cần thiết
        populate: {
          path: "sender", // Populate sender (User hoặc Admin)
          select: "firstName lastName imageUrl role ", // Chỉ lấy tên và vai trò
        },
      });

    if (!conversation) {
      return res.status(404).json({ error: "Không tìm thấy cuộc trò chuyện" });
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
