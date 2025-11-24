// index.js (root)
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import emailRouter from "./routes/email.route.js";
import dashboardRouter from "./routes/dashboard.js";
import homeRouter from "./routes/homePage.js";
import bookingRouter from "./routes/booking.route.js"
import notificationRouter from "./routes/notification.js";

import http from "http";
import { initSocket } from "./socket/socket.js";

const app = express();
const PORT = process.env.PORT || 3000;

// DB
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing/", listingRouter);
app.use("/api/email", emailRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/home", homeRouter);
app.use("/api/booking",bookingRouter)
app.use("/api/notifications", notificationRouter);

// create server and init socket
const server = http.createServer(app);
 export const io = initSocket(server, { origin: "http://localhost:5173" });

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
