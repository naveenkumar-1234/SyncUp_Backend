import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/user.model";
import Room from "./model/room.model";

dotenv.config(); 

async function setup() {
  try {
    const url : string = process.env.MONGO_URI || "";
    await mongoose.connect(url);
    console.log("Connected to db");

    const defaultRoom1 = await Room.create({
      roomName: "General",
      roomCreator: new mongoose.Types.ObjectId(),
      users: [],
      isPrivate: false,
    });

    const defaultRoom2 = await Room.create({
      roomName: "Fun Talk",
      roomCreator: new mongoose.Types.ObjectId(),
      users: [],
      isPrivate: false,
    });

    const user1 = await User.create({
      username: "naveen",
      email: "naveen@gmail.com",
      password: "password",
      rooms: [defaultRoom1._id, defaultRoom2._id],
    });

    const user2 = await User.create({
      username: "tester",
      email: "test@gmail.com",
      password: "password",
      rooms: [defaultRoom1._id],
    });


    await Room.updateMany(
      { _id: { 
        $in: [defaultRoom1._id, defaultRoom2._id]
     } },
      { $addToSet: { 
        users: [user1._id, user2._id] 
    } }
    );
    

    console.log("Test data creted");
    process.exit();
  } catch (err) {
    console.error("Error in setup", err);
    process.exit(1);
  }
}

setup();
