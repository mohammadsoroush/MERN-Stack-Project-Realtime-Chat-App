import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getIO, getReceiversSocketIds, onlineUsersMap } from "../lib/socket.js";
export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching user for sidebar:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const myId = req.user._id;
    const otherUserId = req.params.id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages between users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessageToUser = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const { text, image } = req.body;

    let imageUrl = null;

    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image);
      imageUrl = uploadResult.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    console.log("🔍 receiverId:", receiverId);
    console.log("🔍 onlineUsersMap:", onlineUsersMap);
    const receiversSocketIds = getReceiversSocketIds(receiverId);
    console.log("🎯 receiversSocketIds:", receiversSocketIds);
    // const receiversSocketIds = getReceiversSocketIds(receiverId);

    const io = getIO(); // اینجا io را دریافت کن

    if (receiversSocketIds.length > 0) {
      io.to(receiversSocketIds).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
