import mongoose, {Schema} from "mongoose";

const queueSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    currentServing: {
      type: Schema.Types.ObjectId,
      ref: "QueueEntry",
      default: null,
    },
    nextTokenNumber: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED", "PAUSED"],
      default: "OPEN",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customersServed: {
      type: Number,
      default: 0,
    },
    averageServiceTime: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

queueSchema.index(
  {
    tenantId: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

const Queue = mongoose.model("Queue", queueSchema);

export default Queue;