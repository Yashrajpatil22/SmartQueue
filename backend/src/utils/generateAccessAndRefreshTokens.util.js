import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const generateAccessAndRefreshTokens = async (user) => {
  try{
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  }catch (error) {
    throw new Error("Error generating authentication tokens");
  }
};

export default generateAccessAndRefreshTokens;