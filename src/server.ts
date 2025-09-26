import connectDB from "./config/db";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import { verifyToken } from "./utils/jwt";
import User from "./model/user.model";
import Message from "./model/message.model";
import express, { Request, Response } from "express";
import routes from "./routes";
import cors from "cors";
import { socketController } from "./controller/socket.controller";
import { socketService } from "./service/socker.service";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const server = http.createServer(app);

app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "working",
    version: 2,
  });
});

app.use("/", routes);

const PORT = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketController(io);

// socketService(io);



io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  // console.log("Client name")

  socket.on("joinRoom", async (roomId: string) => {
    try {
      const user = socket.data.user;
      console.log("inside joinRoom");

      if (!user) throw new Error("Not authenticated");

      //  if(!user.rooms.includes(roomId)){
      //     user.rooms.push(roomId);
      //     await user.save()
      //  }
      socket.join(roomId);
      console.log(`${user.username} joined room ${roomId}`);

       const message = await Message.find({room:roomId}).sort({createdAt : -1}).limit(50).lean();
       socket.emit('roomHistroy',message.reverse())
    } catch (error: any) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("sendMessage", async ({ roomId, content }) => {
    try {
      const user = socket.data.user;
      if (!user) throw new Error("Not authenticated");
      if (!content.trim()) throw new Error("Message cannot be empty");
      //  const message = new Message({
      //     sender : user._id,
      //     content: content,
      //     room: roomId,
      //     senderUsername:user.username
      //  })
      //  await message.save();
      const newMessage = {
        _id: Date.now().toString(), 
        room: roomId,
        sender: user._id,
        senderUsername: user.username,
        content: content.trim(),
        createdAt: new Date(),
      };
      console.log(
        "Room :",
        roomId,
        " User ",
        socket.data.user.username,
        " sended ",
        content
      );

      io.to(roomId).emit("newMessage", newMessage);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("leaveRoom", async (roomId: string) => {
    try {
      const user = socket.data.user;

      if (!user) throw new Error("Not authenticated");

      socket.leave(roomId);
      console.log(`${user.username} left room ${roomId}`);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.data.user?.username);
  });
});

server.on("error", (err) => {
  console.log(err);
});

server.listen(PORT, () => {
  console.log(`Socket.IO running in PORT ${PORT}`);
});
