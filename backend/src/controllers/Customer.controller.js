import Queue from "../models/Queue.model.js";
import QueueEntry from "../models/QueueEntry.model.js";
import mongoose from "mongoose";
import { getQueueUsingId } from "../utils/getQueue.js";
import {
  QUEUE_ENTRY_STATUS,
  ACTIVE_QUEUE_STATUSES,
  TERMINAL_QUEUE_STATUSES,
} from "../constants/queueStatus.js";

const getQueueDetails = async (req, res) => {
  const { queueId } = req.params;
  try {
    const queue = await (await getQueueUsingId(queueId)).populate("tenantId");
    res
      .status(200)
      .json({ queueName: queue.name, businessName: queue.tenantId.name });
  } catch (error) {
    console.error("Error fetching queue details:", error);
    res.status(500).json({ message: "Failed to fetch queue details." });
  }
};

const getQueueEntryStatus = async (req, res) => {
  const { entryId } = req.params;
  try {
    const entry = await QueueEntry.findById(entryId)
      .populate("queueId")
      .populate("tenantId");

    if (!entry) {
      return res.status(404).json({ message: "Queue entry not found." });
    }
    const customerAheadCount = await QueueEntry.countDocuments({
      queueDate: entry.queueDate,
      queueId: entry.queueId,
      status: QUEUE_ENTRY_STATUS.WAITING,
      tokenNumber: {
        $lt: entry.tokenNumber,
      },
    });
    res.status(200).json({
      message: "Queue entry status fetched successfully.",
      entry: {
        tokenNumber: entry.tokenNumber,
        status: entry.status,
        customerAheadCount: customerAheadCount,
        waitingTimeEstimate:
          customerAheadCount * entry.queueId.averageServiceTime,
        queueId: entry.queueId._id,
        queueName: entry.queueId.name,
        businessName: entry.tenantId.name,
      },
    });
  } catch (error) {
    console.error("Error fetching queue entry status:", error);
    res.status(500).json({ message: "Failed to fetch queue entry status." });
  }
};

export { getQueueDetails, getQueueEntryStatus };
