import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt";
import User from "../model/user.model";



export const valitateUser=(io:Server)=>{
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

}