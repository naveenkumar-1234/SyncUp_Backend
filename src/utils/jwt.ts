import jwt from "jsonwebtoken";
import {IUser} from "../model/user.model";
import dotenv from "dotenv"
dotenv.config()

const key : jwt.Secret = process.env.JWT_SECRET_KEY || "Sdsdsdsdskdhsdjfkjdds";

// const key : string = "Sdsdsdsdskdhsdjfkjdds";
const exp  = '1d';

export const generateToken= (user:IUser) : string => {

    return jwt.sign(
        {id: user._id , username :user.username},
        key,
        {expiresIn:exp}
    )
    
}


export const verifyToken = (token: string): { id: string, username: string } => {
    try {
        const isValid = jwt.verify(token, key) as { id: string, username: string };
        return isValid;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}
