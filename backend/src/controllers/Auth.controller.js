import Tenant from "../models/Tenant.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";

const createTenant = async (req, res) => {
  
  const { tenantName, phone, userName, email, password } = req.body;
  if (!tenantName || !phone || !userName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
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
    const registeredUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    const accessToken = registeredUser.generateAccessToken();
    const refreshToken = registeredUser.generateRefreshToken();
    await registeredUser.save({ validateBeforeSave: false });

    const options = {
        httpOnly: true,
        secure: true
    }

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
      return res.status(400).json({
        message: `A user or tenant with this ${duplicatedField} already exists.`,
      });
    }

    return res.status(500).json({ message: "Error during registration", error: error.message });
  }
  finally {
    await session.endSession();
  }
  
};

export { createTenant };
