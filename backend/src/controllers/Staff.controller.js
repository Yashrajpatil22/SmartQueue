import User from "../models/User.model.js";
import mongoose from "mongoose";

const createStaff = async (req, res) => {
  const manager = req.user;
  if(manager.role !== "MANAGER"){
    return res.status(403).json({ message: "Only managers can create staff" });
  }
  const { name, email, password } = req.body;
  const fields = [name, email, password];

  if (fields.some((field) => !field?.trim())) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  try {
    const existingStaff = await User.findOne({ email });
    if (existingStaff) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const staff = await User.create({
      name,
      email,
      password,
      role: "STAFF",
      tenantId: manager.tenantId,
    });
    const createdStaff = await User.findById(staff._id).select("-password -refreshToken");
    if (!createdStaff) {
      return res.status(500).json({ message: "Error retrieving created staff" });
    }
    return res
      .status(201)
      .json({ message: "Staff created successfully", createdStaff });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error during staff creation", error: error.message });
  }
};

export { createStaff };
