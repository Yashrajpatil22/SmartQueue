import mongoose, { Schema } from "mongoose";

const TenantSchema = new Schema(
  {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }
  },
  {
    timestamps: true,
  },
);

const Tenant = mongoose.model("Tenant", TenantSchema);
export default Tenant;