import express from "express";
import mongoose from "mongoose";
import Queue from "../models/Queue.model.js";
import QueueEntry from "../models/QueueEntry.model.js";
import { getQueueUsingId } from "../utils/getQueue.js";
import {
  QUEUE_ENTRY_STATUS,
  ACTIVE_QUEUE_STATUSES,
  TERMINAL_QUEUE_STATUSES,
} from "../constants/queueStatus.js";

const getAnalytics = async (req, res) => {
//   const { queueId } = req.params;
  const manager = req.user;
  try {
    const totalEntries = await QueueEntry.countDocuments({
      tenantId: manager.tenantId,
    });
    const totalWaitingEntries = await QueueEntry.countDocuments({
      tenantId: manager.tenantId,
      status: QUEUE_ENTRY_STATUS.WAITING,
    });
    const totalServedEntries = await QueueEntry.countDocuments({
      tenantId: manager.tenantId,
      status: QUEUE_ENTRY_STATUS.SERVED,
    });
    const totalCancelledEntries = await QueueEntry.countDocuments({
      tenantId: manager.tenantId,
      status: QUEUE_ENTRY_STATUS.CANCELLED,
    });
    const totalSkippedEntries = await QueueEntry.countDocuments({
      tenantId: manager.tenantId,
      status: QUEUE_ENTRY_STATUS.SKIPPED,
    });
    const totalQueues = await Queue.countDocuments({
      tenantId: manager.tenantId,
    });
    const activeQueues = await Queue.countDocuments({
      tenantId: manager.tenantId,
      status: "OPEN",
    });
    const closedQueues = await Queue.countDocuments({
      tenantId: manager.tenantId,
      status: "CLOSED",
    });
    const pausedQueues = await Queue.countDocuments({
      tenantId: manager.tenantId,
      status: "PAUSED",
    });
    return res.status(200).json({
      message: "Analytics fetched successfully",
      data: {
        totalEntries,
        totalWaitingEntries,
        totalServedEntries,
        totalCancelledEntries,
        totalSkippedEntries,
        totalQueues,
        activeQueues,
        closedQueues,
        pausedQueues
      }
    });
  }catch (error) {
    return res.status(500).json({
      message: "Error fetching analytics",
      error: error.message
    });
  }
};

export { getAnalytics };