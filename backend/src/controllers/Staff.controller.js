import User from "../models/User.model.js";
import mongoose from "mongoose";
import getStaff from "../utils/getStaffFromTenant.util.js";
import USER_SAFE_FIELDS from "../constants/userSelect.js";

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
      USER_SAFE_FIELDS,
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
  const manager = req.user;
  const { staffId } = req.params;
  try{
    const staff = await getStaff(manager.tenantId, staffId);
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
  try {
    const staff = await User.find({
      role: "STAFF",
      tenantId: manager.tenantId,
    }).select(USER_SAFE_FIELDS);
    return res
      .status(200)
      .json({ message: "Staff retrieven successfully", staff });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong while retrieving staff" });
  }
};

const deleteStaff = async (req, res) => {
  const manager = req.user;
  const { staffId } = req.params;
  try{
    const staff = await getStaff(manager.tenantId, staffId);
    await staff.deleteOne();
    return res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete staff" });
  }
};

const updateStaff = async (req, res) => {
  const manager = req.user;
  const { staffId } = req.params;
  const { name, email, password } = req.body ?? {};
  if(!name?.trim() && !email?.trim() && !password?.trim()) {
    return res.status(400).json({ message: "At least one field is required to update" });
  }
  try{
    const staff = await getStaff(manager.tenantId, staffId);

    if(name?.trim()) staff.name = name;
    if(email?.trim()){
      const existingStaff = await User.findOne({ email });
      if(existingStaff && !existingStaff._id.equals(staffId)) {
        return res.status(400).json({ message: "Email is already in use by another staff member" });
      }
      staff.email = email;
    }
    if(password?.trim()) staff.password = password;
    await staff.save();
    const updatedStaff = await User.findById(staffId).select(USER_SAFE_FIELDS);
    return res.status(200).json({ message: "Staff updated successfully", updatedStaff });
  }catch(error){
    return res.status(500).json({ message: "Failed to update staff", error: error.message });
  }
  
}

export { createStaff, getStaffById, getAllStaff, deleteStaff, updateStaff };
