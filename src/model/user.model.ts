import mongoose,{Schema,Document} from "mongoose";
import bcrypt from "bcryptjs"

export interface IUser extends Document{
    username : string
    email : string
    password : string
    isPremium : boolean;
    rooms : mongoose.Types.ObjectId[];
    comparePassword(candidatePass :string) : Promise<boolean>
}

const UserSchema = new Schema<IUser>({

    username :{
        type: String,
        required : true,
        unique : true,
        trim:true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    password:{
        type: String,
        required: true
    },
    rooms:[{
        type: Schema.Types.ObjectId,
        ref :'Room',
        default: []
    }]
},{timestamps:true})

UserSchema.pre('save',async function(next) {
    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})


UserSchema.methods.comparePassword = async function(candidatePass : string): Promise<boolean>{
    return await bcrypt.compare(candidatePass,this.password);
    
}

export default mongoose.model<IUser>('User',UserSchema)