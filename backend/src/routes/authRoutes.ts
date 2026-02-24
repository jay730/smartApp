import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepo from "../repository/userRepository";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const register = async (req:any, res:any)=>{
    const{email, password}= req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await userRepo.createUser(email,hashedPassword);
    res.json(user);
}

export const login = async(req:any,res:any)=>{
const{email, password}= req.body;
const user = await userRepo.findByEmail(email);
if(!email) return res.status(401).json({message:"Invalid credentials"});
const valid = await bcrypt.compare(password, user.password);
if(!valid) return res.status(401).json({message: "Invalid credentials"});
const token = jwt.sign({userId:user.id}, JWT_SECRET,{expiresIn:"1h"});
res.json({token});
}