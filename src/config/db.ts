import mongoose from "mongoose";
import dotenv from "dotenv"
import roomModel from "../model/room.model";
import userModel from "../model/user.model";
import messageModel from "../model/message.model";

dotenv.config()


const MONGO_URL = process.env.MONGO_URI || "";

const connectDB = async () => {

    try{
        await mongoose.connect(MONGO_URL);
        console.log("MongoDB connected successfully");
        //  const collections = await mongoose.connection.db?.listCollections().toArray();
        // console.log("Available collections:", collections?.map(c => c.name));

        
        roomModel.findOne();
        userModel.findOne();
        messageModel.findOne();
        mongoose.connection.on("connected",() => {
            console.log("Mongoose connected successfully");
        })

        mongoose.connection.on('error',(err) => {
            console.log("Mongoose connected failed: ",err);
        })
        
        mongoose.connection.on('disconnected',() => {
            console.log("Mongoose disconnected");
        })

    }catch(err){

        console.error("Database connection failed: ",err);
        
    }
}

export default connectDB;