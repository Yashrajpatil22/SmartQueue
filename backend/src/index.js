import express from "express";
import connectDb from "./db/index.js";
import dotenv from "dotenv";
import http from "http";
import authRouter from "./routes/Auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import staffRouter from "./routes/Staff.route.js";
import queueRouter from "./routes/Queue.route.js";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
  },
});
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {origin: "http://localhost:5173", credentials: true}
));
app.use("/api/auth", authRouter);
app.use("/api/staff", staffRouter);
app.use("/api/queue", queueRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
io.on("connection", (socket) => {
  console.log("A user connected");
  // console.log(socket);
  socket.emit("welcome", {
    message: "Welcome to SmartQueue",
  });
  socket.on("helloServer", (data) => {
    console.log(data.message);
  });
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
