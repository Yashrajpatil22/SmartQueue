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
  let user;
  let tenant;
  try {
    tenant = await Tenant.create({
      name: tenantName,
      phone,
    }, { session });
    if (tenant) {
      console.log("Tenant created successfully");
    }
  
    user = await User.create({
      name: userName,
      email,
      password,
      role: "MANAGER",
      tenantId: tenant._id,
    }, { session });
    if (user) {
      console.log("User created successfully");
    }
    await session.commitTransaction();
    // session.endSession();
    const registeredUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );
    return res.status(201).json({
      message: "Tenant and user created successfully",
      tenant,
      registeredUser,
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

    return res.status(500).json({ message: "Error creating user" });
  }
  finally {
    await session.endSession();
  }
  
};
