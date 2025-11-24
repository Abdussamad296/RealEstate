import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getAllNotifications, getDropdownNotifications,markAllRead,markNotificationAsRead } from "../controller/notifications.js";

const router = express.Router();

router.get("/get-notifications",verifyToken,getDropdownNotifications );
router.put("/mark-as-read/:notificationId",verifyToken, markNotificationAsRead);
router.put("/read-all-notifications",verifyToken,markAllRead);
router.get("/all-notifications",verifyToken,getAllNotifications);


export default router;