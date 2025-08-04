import connectDB from "./config/db";
import dotenv from "dotenv"
import { Server } from "socket.io";
import http from 'http'
import { verifyToken } from "./utils/jwt";
import User from "./model/user.model";
import Message from "./model/message.model";
import express, { Request, Response } from "express";
import routes from "./routes";
import cors from "cors"
import { socketController } from "./controller/socket.controller";
dotenv.config()

connectDB()

const app = express();

app.use(express.json());
app.use(cors({
    origin:"*",
    credentials:true
}))


const server = http.createServer(app);


app.get("/",(req : Request, res : Response)=>{
    res.json({
        "status":"working",
        "version" : 2
    }

    )
})

app.use('/',routes)


const PORT = process.env.PORT || 3000;


const io = new Server(server,{
    cors:{
        origin: "*",
        methods: ['GET','POST']
    }
})

// socketController(io);

io.use(async(socket,next)=>{
    try {
        const token = socket.handshake.auth.token || 
                 socket.handshake.headers.authorization?.split(' ')[1];
        if(!token){
            throw new Error("Auth error")

        }
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            throw new Error("User not found")
        }
        socket.data.user = user;
        next();
    } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication failed'));
        socket.disconnect(true);
    }
    
})


io.on('connection',(socket)=>{
    console.log("New client connected",socket.id)
    
    socket.on('joinRoom',async(roomId:string) =>{
        try {
            const user = socket.data.user;
             if (!user) throw new Error('Not authenticated');

             if(!user.rooms.includes(roomId)){
                user.rooms.push(roomId);
                await user.save()
             }
             socket.join(roomId);
             console.log(`${user.username} joined room ${roomId}`);
             
             const message = await Message.find({room:roomId}).sort({createdAt : -1}).limit(50).lean();
             socket.emit('roomHistroy',message.reverse())


        } catch (error :any) {
            socket.emit('error', { message: error.message });
            
        }
    })

    socket.on("sendMessage",async({roomId,content})=>{
        try {
            const user = socket.data.user;
             if (!user) throw new Error('Not authenticated');
             if (!content.trim()) throw new Error('Message cannot be empty');
             const message = new Message({
                sender : user._id,
                content: content,
                room: roomId,
                senderUsername:user.username
             })
             await message.save();
             io.to(roomId).emit('newMessage',message);
            
        } catch (error) {
            console.log(error)
        }
    })
    socket.on('leaveRoom', async(roomId :string)=>{
        try {
            const user = socket.data.user;

            if (!user) throw new Error('Not authenticated');

            socket.leave(roomId);
             console.log(`${user.username} left room ${roomId}`);
            
        } catch (error) {
            console.log(error)
        }
    })
    socket.on('disconnect', () => {
    console.log("User disconnected:", socket.data.user?.username);
  });
})


server.on('error',(err)=>{
    console.log(err)
})

server.listen(PORT,()=>{
   console.log(`Socket.IO running in PORT ${PORT}`)
})




