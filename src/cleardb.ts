import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/user.model";
import Room from "./model/room.model";
import Message from "./model/message.model";

dotenv.config();

async function clearDatabase() {
  try {
    const url : string = process.env.MONGO_URI || "";
        await mongoose.connect(url);
    await User.deleteMany({});
    await Room.deleteMany({});
    await Message.deleteMany({});
    console.log("All data deleted 🔥");
    process.exit();
  } catch (err) {
    console.error("Error clearing DB:", err);
    process.exit(1);
  }
}

clearDatabase();
