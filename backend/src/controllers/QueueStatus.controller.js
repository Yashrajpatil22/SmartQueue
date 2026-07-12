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
        "averageServiceTime": queue.averageServiceTime,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching queue status",
      error: error.message,
    });
  }
};

const queueEntryStatus = async (req, res) => {
    const { entryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return res.status(400).json({
        message: "Invalid entry ID",
      });
    }
    try{
        const entry = await QueueEntry.findById(entryId).populate("queueId").populate("tenantId");
        if (!entry) {
            return res.status(404).json({
                message: "Queue entry not found",
            });
        }
        const customerAheadCount = await QueueEntry.countDocuments({
          queueDate: entry.queueDate,
          queueId: entry.queueId,
          status: QUEUE_ENTRY_STATUS.WAITING,
          tokenNumber: {
            $lt: entry.tokenNumber,
          },
        });

        return res.status(200).json({
            message: "Queue entry status fetched successfully",
            entry: {
                "tokenNumber": entry.tokenNumber,
                "status": entry.status,
                "customerAheadCount": customerAheadCount,
                "waitingTimeEstimate": customerAheadCount * entry.queueId.averageServiceTime,
                "queueName": entry.queueId.name,
                "businessName": entry.tenantId.name,
            },
        });

    }catch(error){
        return res.status(500).json({
            message: "Error fetching queue entry status",
            error: error.message,
        });
    }
}

const getQueueAnalytics = async (req, res) => {
    const { queueId } = req.params;
    try{
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const queue = await getQueueUsingId(queueId);
        const totalEntries = await QueueEntry.countDocuments({ queueId, queueDate: today });
        const skippedEntries = await QueueEntry.countDocuments({ queueId, status: QUEUE_ENTRY_STATUS.SKIPPED, queueDate: today });
        const cancelledEntries = await QueueEntry.countDocuments({ queueId, status: QUEUE_ENTRY_STATUS.CANCELLED, queueDate: today });
        const servedEntries = await QueueEntry.countDocuments({ queueId, status: QUEUE_ENTRY_STATUS.SERVED, queueDate: today });
        const waitingEntries = await QueueEntry.countDocuments({ queueId, status: QUEUE_ENTRY_STATUS.WAITING, queueDate: today });
        return res.status(200).json({
            message: "Queue analytics fetched successfully",
            analytics: {
                "totalEntries": totalEntries,
                "skippedEntries": skippedEntries,
                "cancelledEntries": cancelledEntries,
                "servedEntries": servedEntries,
                "waitingEntries": waitingEntries,
            }})
    }catch(error){
        return res.status(500).json({
            message: "Error fetching queue analytics",
            error: error.message,
        });
    }
}

export { queueStatus, queueEntryStatus, getQueueAnalytics };
