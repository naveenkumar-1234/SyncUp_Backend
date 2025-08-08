import mongoose,{Document,Schema} from "mongoose";

export interface IMessage extends Document{
    sender : mongoose.Types.ObjectId;

    senderUsername:string
    content : string;
    room : mongoose.Types.ObjectId;
    createdAt : Date;
}



const messageSchema = new Schema<IMessage>({
    sender: { type: Schema.Types.ObjectId , ref : 'User', required: true },
    senderUsername: { type: String, required: true },
    room: { type: Schema.Types.ObjectId,ref:'Room', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})


export default mongoose.model<IMessage>('Message',messageSchema);