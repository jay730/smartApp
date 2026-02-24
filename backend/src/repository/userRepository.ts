import db from "../db";

export const createUser = async(email:string, password:string)=>{
    return db("users").insert({email, password}).returning("*");
};

export const findByEmail = async(email:string)=>{
    return db("users").where({email}).first();
};