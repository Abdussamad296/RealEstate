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


const app = express();
const PORT = process.env.PORT || 3000;

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing/", listingRouter);
app.use("/api/email", emailRouter);
app.use("/api/dashboard", dashboardRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});