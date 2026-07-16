import express from "express";
import connectDb from "./db/index.js";
import dotenv from "dotenv";
import http from "http";
import authRouter from "./routes/Auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import staffRouter from "./routes/Staff.route.js";
import queueRouter from "./routes/Queue.route.js";
import analyticsRouter from "./routes/Analytics.route.js";
import customerRouter from "./routes/Customer.route.js";
import { initializeSocket } from "./socket/socket.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
initializeSocket(server);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {origin: process.env.CORS_ORIGIN, credentials: true}
));
app.use("/api/auth", authRouter);
app.use("/api/staff", staffRouter);
app.use("/api/queue", queueRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/customer", customerRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

connectDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });
