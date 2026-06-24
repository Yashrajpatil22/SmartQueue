// import express from "express";
import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

const connectDb = async () => {
    try{
        const conn = await mongoose.connect(`${process.env.MONGO_DB_URI}/${process.env.DB_NAME}`);
        if(conn){
            console.log("MongoDB Connected");
        }
    }catch(err){
        console.log("Failed to connect to MongoDB", err);
        process.exit(1);
    }
}

export default connectDb;