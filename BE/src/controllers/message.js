import Users from "../models/users.js";
import Messages from "../models/message.js";

// For Admin
export const getAllUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await Users.find({
      _id: { $ne: id },
      chatted: true,
      isDeleted: false,
    }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId, myId } = req.params;

    const messages = await Messages.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId, myId: senderId } = req.params;

    const 
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
