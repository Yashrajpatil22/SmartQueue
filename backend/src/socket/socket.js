//backend/src/socket/socket.js

import {Server} from "socket.io";
let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
      cors: {
        origin: ["http://127.0.0.1:5500", "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true,
      },
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
      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
      socket.on("joinQueue", (queueId) => {
        console.log(`Socket: ${socket.id} User joined queue: ${queueId}`);
      });
    });
}

export const getIo = () => {
    if(!io){
        throw new Error("Socket.io not initialized");
    }
    return io;
}