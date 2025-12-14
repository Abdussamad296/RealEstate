import Message from "../model/message.model.js";
import { isUserOnline } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    console.log("req body", req.body);

    const msg = await Message.create(req.body);

    // Populate for socket emit (optional but recommended)
    const populatedMsg = await Message.findById(msg._id)
      .populate("buyerId", "username avatar")
      .populate("sellerId", "username avatar");

    res.json(populatedMsg || msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 2. Get Conversations List — FIXED with real names + buyerId/sellerId
export const getConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Get all messages where user is buyer or seller
    const messages = await Message.find({
      $or: [{ buyerId: currentUserId }, { sellerId: currentUserId }],
    })
      .sort({ createdAt: -1 })
      .populate("buyerId", "username avatar")
      .populate("sellerId", "username avatar");

    const convos = {};

    for (const msg of messages) {
      const isBuyer = msg.buyerId._id.toString() === currentUserId;
      const otherUser = isBuyer ? msg.sellerId : msg.buyerId;

      const key = `${msg.listingId}-${otherUser._id}`;

      if (!convos[key]) {
        convos[key] = {
          listingId: msg.listingId.toString(),
          buyerId: msg.buyerId._id.toString(),
          sellerId: msg.sellerId._id.toString(),
          otherUserId: otherUser._id.toString(),
          otherUserName: otherUser.username || "Unknown User",
          otherUserAvatar: otherUser.avatar || null,
          lastMessage: msg.message,
          time: msg.createdAt,
          online: isUserOnline(otherUser._id.toString()),
        };
      } else {
        // Update last message if this one is newer
        if (msg.createdAt > convos[key].time) {
          convos[key].lastMessage = msg.message;
          convos[key].time = msg.createdAt;
          convos[key].online = isUserOnline(otherUser._id.toString());
        }
      }
    }

    // Sort conversations by latest message time
    const sortedConvos = Object.values(convos).sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );

    res.json(sortedConvos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load conversations" });
  }
};

// 3. Get Specific Chat Messages (minor improvement)
export const getUserConversation = async (req, res) => {
  try {
    const { listingId, otherUserId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      listingId,
      $or: [
        { buyerId: currentUserId, sellerId: otherUserId },
        { buyerId: otherUserId, sellerId: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("buyerId", "username")
      .populate("sellerId", "username")
      .lean();

    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load messages" });
  }
};
