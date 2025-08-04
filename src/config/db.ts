import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()


const MONGO_URL = process.env.DB_URL || "";

const connectDB = async () => {

    try{
        await mongoose.connect(MONGO_URL);
        console.log("MongoDB connected successfully");

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