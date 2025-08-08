import { Server } from "socket.io"



export const socketService = (io:Server) => {

    io.on("connection",(socket)=>{

        socket.on("generalRoom",(ss)=>{
            

        })

    })

}