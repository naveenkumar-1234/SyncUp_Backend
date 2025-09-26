import { Request, Response } from "express";
import User from "../model/user.model";
import Room from "../model/room.model";
import mongoose from "mongoose";

export const getRoomsOfUser = async(req :Request , res : Response) => {

    const userId = req.params.userId;

    console.log(userId)

    try {
        // console.log(mongoose.modelNames())
        // console.log('Room' in mongoose.models);
        console.log("at get rooms");
        
        const user = await User.findById(userId).populate('rooms');
        // console.log(user);
        
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.rooms);
    } catch (error:any) {
        console.error("Error fetching user rooms:", error);
        res.status(500).json({ message: "Server error", er:error.message });
    }



}