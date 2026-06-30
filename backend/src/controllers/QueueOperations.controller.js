import Queue from "../models/Queue.model.js";
import mongoose from "mongoose";
import { getQueue, getQueueUsingId } from "../utils/getQueue.js";
import QueueEntry from "../models/QueueEntry.model.js";
import {
  QUEUE_ENTRY_STATUS,
  ACTIVE_QUEUE_STATUSES,
  TERMINAL_QUEUE_STATUSES,
} from "../constants/queueStatus.js";

const joinQueue = async (req, res) => {
  const { queueId } = req.params;
  let { customerName, phoneNumber } = req.body;
  customerName = customerName?.trim();
  phoneNumber = phoneNumber?.trim();
  if (!customerName || !phoneNumber) {
    return res.status(400).json({
      message: "Customer name and phone number are required",
    });
  }
  let session;
  try {
    const queue = await getQueueUsingId(queueId);

    if (queue.status !== "OPEN") {
      return res.status(400).json({
        message: "Queue is not open for joining",
      });
    }
    const existingCustomer = await QueueEntry.findOne({
      queueId,
      phoneNumber,
      status: {
        $in: ACTIVE_QUEUE_STATUSES,
      },
    });
    if (existingCustomer) {
      return res.status(409).json({
        message: "Customer is already in the queue",
      });
    }
    session = await mongoose.startSession();
    session.startTransaction();
    const updatedQueue = await Queue.findOneAndUpdate(
      {
        _id: queueId,
        status: "OPEN",
      },
      {
        $inc: {
          nextTokenNumber: 1,
        },
      },
      {
        returnDocument: "before",
        session,
      },
    );
    if (!updatedQueue) {
      await session.abortTransaction();
      await session.endSession();

      return res.status(400).json({
        message: "Queue is no longer open",
      });
    }
    const queueEntry = new QueueEntry({
      queueId,
      customerName,
      phoneNumber,
      tenantId: queue.tenantId,
      tokenNumber: updatedQueue.nextTokenNumber,
    });
    await queueEntry.save({ session });
    // queue.nextTokenNumber += 1;
    // await queue.save({session});
    await session.commitTransaction();
    await session.endSession();
    return res.status(201).json({
      message: "Customer joined the queue successfully",
      queueEntry,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      await session.endSession();
    }

    if (error.message === "Queue not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (error.message === "Invalid queue ID") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Error joining queue",
      error: error.message,
    });
  }
};

export { joinQueue };