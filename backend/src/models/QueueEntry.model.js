import mongoose from "mongoose";

const queueEntrySchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    queueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Queue",
        required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    tokenNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["WAITING", "CALLED","SERVED", "CANCELLED","SKIPPED"],
      default: "WAITING",
    },
    calledAt: {
      type: Date,
    },
    servedAt: {
      type: Date,
    },
    servedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  },
  {
    timestamps: true,
  },
);

const QueueEntry = mongoose.model("QueueEntry", queueEntrySchema);

export default QueueEntry;
