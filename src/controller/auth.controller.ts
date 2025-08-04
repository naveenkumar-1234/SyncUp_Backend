import { Response,Request } from "express";

import User, { IUser } from "../model/user.model";
import { generateToken } from "../utils/jwt";


export const register = async(req:Request , res:Response) => {
    try{
        const {username, email,password} = req.body;
        const existingUser = await User.findOne({$or : [{username},{email}]})

        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const user = new User({username,email,password});
        await user.save();
        const token = generateToken(user);
        return res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
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
        res.status(201).json({token,user:{
            id: user._id,
            username :user.username}})
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server error"})
    }
}