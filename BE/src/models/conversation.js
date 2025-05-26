import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // User tham gia cuộc trò chuyện
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }], // Danh sách các admin tham gia
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Các tin nhắn liên quan
  updatedAt: { type: Date, default: Date.now }, // Thời gian cập nhật gần nhất
});

export default mongoose.model("Conversation", ConversationSchema);
