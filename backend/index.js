// index.js — FINAL CORRECT ORDER

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import path from "path";

import http from "http";
import { initSocket } from "./socket/socket.js";

// Routes (import after)
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import emailRouter from "./routes/email.route.js";
import dashboardRouter from "./routes/dashboard.js";
import homeRouter from "./routes/homePage.js";
import bookingRouter from "./routes/booking.route.js";
import notificationRouter from "./routes/notification.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);
app.use("/api/email", emailRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/home", homeRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/notifications", notificationRouter);

// CRITICAL: Create server + init Socket.IO BEFORE server.listen()
const server = http.createServer(app);

// Initialize Socket.IO IMMEDIATELY after server creation
initSocket(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// Start listening
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});