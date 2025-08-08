import { Response,Request } from "express";

import User, { IUser } from "../model/user.model";
import { generateToken } from "../utils/jwt";
import Room from "../model/room.model";
import mongoose, { Schema } from "mongoose";

export const register = async(req:Request , res:Response) => {

    try{
        const {username, email,password} = req.body;

        const existingUser = await User.findOne({$or : [{username},{email}]})

        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const user  = new User({username,email,password});
        await user.save();
        // const user_id : mongoose.Types.ObjectId = user._id;

    //     let defaultRoom = await Room.findOne({ roomName: "General" });
    //     let defaultRoom2 = await Room.findOne({ roomName: "Fun Talk" });

    //     if (!defaultRoom) {
    //      defaultRoom = new Room({
    //     roomName: "General",
    //     roomCreator: new mongoose.Types.ObjectId(),
    //     users: [],
    //     isPrivate: false,
    //   });
    //     await defaultRoom.save()
    // }else {
            
            
    //         defaultRoom.users.push(user_id);
    //         await defaultRoom.save();
    //     }

    //     if (!defaultRoom2) {
    //      defaultRoom2 = new Room({
    //     roomName: "General",
    //     roomCreator: new mongoose.Types.ObjectId(),
    //     users: [],
    //     isPrivate: false,
    //   });}

        
        // defaultRoom?.users.push(user._id)        
        // defaultRoom2?.users.push(user._id)        
        

        // user.rooms.push(defaultRoom,defaultRoom2)
        const token = generateToken(user);
        console.log("User registered")

        return res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                rooms:user.rooms
            }
        });

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server error"})
    }

}


export const login = async(req:Request,res:Response) =>{
    try{
        const {email, password} = req.body;

        const user : IUser | null = await User.findOne({email})
        
        if(!user){
        return res.status(404).json({message:"User not found"})
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
        return res.status(404).json({message:"User not found"})
        
        }
        const token =  generateToken(user);
        console.log("User logged in")

        res.status(201).json({token,user:{
            id: user._id,
            username :user.username,
            rooms:user.rooms
        }})
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server error"})
    }
}