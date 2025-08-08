import mongoose , { Document,Schema } from "mongoose";


export interface IRoom extends Document{
    roomName : string;
    roomCreator: mongoose.Types.ObjectId;
    messages:[mongoose.Types.ObjectId];
    users:[mongoose.Types.ObjectId];
    createdAt: Date;
    isPrivate:boolean;
    password?:string;
}

const roomSchema = new Schema<IRoom>({
    roomName :{
        type: String,
        required : true,
        unique : true,trim :true
    },
    roomCreator:{
        type:Schema.Types.ObjectId, ref: 'User',required:true,
    },
    messages:[{
        type:Schema.Types.ObjectId, ref:'Message',
    }],
    password:{
        type:String,
        default:null
    },
    isPrivate:{
        type:Boolean,
        default:false
    }
    ,
    createdAt:{
        type: Date, default:Date.now
    },
    users:[{
        type:Schema.Types.ObjectId,ref:'User'
    }]

})



export default mongoose.model<IRoom>('Room',roomSchema);