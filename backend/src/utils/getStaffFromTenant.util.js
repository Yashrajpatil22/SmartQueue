import User from "../models/User.model.js";
import mongoose from "mongoose";
import USER_SAFE_FIELDS from "../constants/userSelect.js";

const getStaff = async (tenantId, staffId) => {

    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      throw new Error("Invalid staff ID");
    }
    const staff = await User.findOne({
      _id: staffId,
      tenantId,
      role: "STAFF",
    }).select(USER_SAFE_FIELDS);
    if (!staff) {
      throw new Error("Staff not found");
    }
    return staff;
};

export default getStaff;
