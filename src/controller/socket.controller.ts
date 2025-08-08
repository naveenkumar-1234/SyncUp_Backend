import { Server } from "socket.io"
import { io } from "socket.io-client"
import { verifyToken } from "../utils/jwt";
import { valitateUser } from "../service/auth.service";


export const socketController = (io :Server) => {

    valitateUser(io);

    let actualRoom = ['general','room','funtalk']
    

    io.on("connection",(socket)=>{
        console.log("Socket id:",socket.id)
        console.log("username:",socket.data.user.username);
        
        // socket.emit("error","ists")
        socket.on("generalRoom",(user)=>{
 
            socket.join("generalRoom")
        })

         socket.on("gameRoom",(user)=>{
            socket.join("gameRoom")
        })

        socket.on('send',(message)=>{
            console.log(message ," send by ",socket.data.user.username)
            io.to("generalRoom").emit('rec',message,socket.data.user.username)
        })

        // socket.emit('old',"on server")
        // socket.emit("")
    })
    
    
    
    

}