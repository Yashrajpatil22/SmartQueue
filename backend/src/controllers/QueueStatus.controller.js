import Queue from "../models/Queue.model.js";
import mongoose from "mongoose";
import QueueEntry from "../models/QueueEntry.model.js";
import {
  QUEUE_ENTRY_STATUS,
  ACTIVE_QUEUE_STATUSES,
  TERMINAL_QUEUE_STATUSES,
} from "../constants/queueStatus.js";
import { getQueueUsingId } from "../utils/getQueue.js";

const queueStatus = async (req, res) => {
  const { queueId } = req.params;
  try {
    const queue = await getQueueUsingId(queueId);
    await queue.populate("currentServing");
    const waitingCount = await QueueEntry.countDocuments({
      queueId,
      status: QUEUE_ENTRY_STATUS.WAITING,
    });
    return res.status(200).json({
      message: "Queue status fetched successfully",
      queue: {
        "queueName": queue.name,
        "queueStatus": queue.status,
        "currentServing": {
          "tokenNumber": queue.currentServing?.tokenNumber || null,
          "customerName": queue.currentServing?.customerName || null,
        },
        "waitingCustomers": waitingCount,
        "nextTokenNumber": queue.nextTokenNumber,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching queue status",
      error: error.message,
    });
  }
};

export { queueStatus };
