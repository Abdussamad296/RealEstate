import Notification from "../model/notification.model.js";
import { errorHandler } from "../utils/error.js";

export const getDropdownNotifications = async(req, res) => {
  const userId = req.user.id;
  try {
    const notification = await Notification.find({ recipient: userId })
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .populate("sender.id","name email img");
    return res.status(200).json({
      success: true,
      notifications: notification,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getAllNotifications = async (req, res) => {
  const userId = req.user.id;
  try {
    const { page = 1, limit = 10 } = req.query;
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Notification.countDocuments({ recipient: userId });
    return res.status(200).json({
      success: true,
      notifications,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user.id;
  try {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });
    if (!notification) {
      errorHandler(res, 404, "Notification not found");
    }
    notification.isRead = true;
    await notification.save();
    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res
      .status(200)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
