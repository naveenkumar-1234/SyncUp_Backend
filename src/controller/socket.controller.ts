import { Server } from "socket.io"
import { io } from "socket.io-client"


export const socketController = (io :Server) => {

    io.use((socket,next)=>{

        console.log(socket.handshake.auth);
        
        


    })
    
    
    

}