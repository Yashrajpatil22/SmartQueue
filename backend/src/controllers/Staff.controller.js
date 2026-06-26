import User from "../models/User.model.js";
import mongoose from "mongoose";

const createStaff = async (req, res) => {
  const manager = req.user;
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
    const createdStaff = await User.findById(staff._id).select(
      "-password -refreshToken",
    );
    if (!createdStaff) {
      return res
        .status(500)
        .json({ message: "Error retrieving created staff" });
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

const getStaffById = async (req, res) => {
  const { staffId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(staffId)) {
    return res.status(400).json({ message: "Invalid staff ID" });
  }
  try {
    const staff = await User.findById(staffId).select(
      "-password -refreshToken",
    );
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    return res
      .status(200)
      .json({ message: "Staff retrieved successfully", staff });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving staff", error: error.message });
  }
};

const getAllStaff = async (req, res) => {
  const manager = req.user;
  if (!manager) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  try {
    const staff = await User.find({
      role: "STAFF",
      tenantId: manager.tenantId,
    }).select("-password -refreshToken");
    if(staff.length === 0) {
      return res.status(404).json({ message: "No staff found" , staff });
    }
    return res
      .status(200)
      .json({ message: "Staff retrieven successfully", staff });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong while retrieving staff" });
  }
};

export { createStaff, getStaffById, getAllStaff };
