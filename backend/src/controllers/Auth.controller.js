import Tenant from "../models/Tenant.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";
import generateAccessAndRefreshTokens from "../utils/generateAccessAndRefreshTokens.util.js";

const createTenant = async (req, res) => {
  
  const { tenantName, phone, userName, email, password } = req.body;
  const fields = [tenantName, phone, userName, email, password];

  if (fields.some((field) => !field?.trim())) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  const existingTenant = await Tenant.findOne({ phone });
  if (existingTenant) {
    return res
      .status(400)
      .json({ message: "Tenant with this phone number already exists" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const tenant = new Tenant({
      name: tenantName,
      phone,
    });

    const savedTenant = await tenant.save({ session });
    if (savedTenant) {
      console.log("Tenant created successfully");
    }
  
    const user = new User({
      name: userName,
      email,
      password,
      role: "MANAGER",
      tenantId: tenant._id,
    });

    const savedUser = await user.save({ session });
    if (savedUser) {
      console.log("User created successfully");
    }
    await session.commitTransaction();
    // session.endSession();
    

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);
    const registeredUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res.status(201).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({
      message: "Tenant and user created successfully",
      savedTenant,
      registeredUser,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    await session.abortTransaction();
    // session.endSession();
    if (error.code === 11000) {
      // error.keyValue will tell you which field was duplicated
      const duplicatedField = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        message: `A user or tenant with this ${duplicatedField} already exists.`,
      });
    }

    return res.status(500).json({ message: "Error during registration", error: error.message });
  }
  finally {
    await session.endSession();
  }
  
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const fields = [email, password];

  if (fields.some((field) => !field?.trim())) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  try{
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user);
    const registeredUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({
      message: "Login successful",
      registeredUser,
      accessToken,
      refreshToken,
    });

  }catch(error){
    return res.status(500).json({ message: "Error during login", error: error.message });
  }
}

const refreshAccessToken = async (req, res) => {
  try{
    const refreshToken =
      req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Refresh token does not match" });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({
      message: "Access token refreshed successfully",
      accessToken,
      refreshToken,
    });
  }catch(error){
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }
    return res.status(500).json({ message: "Error during refresh token generation", error: error.message });
  }

}

export { createTenant, login };
