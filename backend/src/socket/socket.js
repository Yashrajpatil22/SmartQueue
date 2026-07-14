//backend/src/socket/socket.js

import {Server} from "socket.io";
let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN,
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
        socket.join(queueId);
        // console.log(socket.rooms);
        // console.log(`Socket: ${socket.id} User joined queue: ${queueId}`);
      });
    });
}

export const getIo = () => {
    if(!io){
        throw new Error("Socket.io not initialized");
    }
    return io;
}