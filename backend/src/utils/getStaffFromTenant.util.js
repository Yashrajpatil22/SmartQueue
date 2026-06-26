import User from "../models/User.model.js";
import mongoose from "mongoose";
import {USER_SAFE_FIELDS} from "../constants/userSelect.js";

const getStaff = async (tenantId, staffId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      throw new Error("Invalid staff ID");
    }
    const staff = await User.findOne({ _id: staffId }).select(USER_SAFE_FIELDS);
    if (!staff) {
      throw new Error("Staff not found");
    }
    if (!staff.tenantId.equals(tenantId)) {
      throw new Error("You are not authorized to perform this action");
    }
    if (staff.role !== "STAFF") {
      throw new Error("User is not a staff member");
    }
    return staff;
  } catch (error) {
    throw error;
  }
};

export default getStaff;
