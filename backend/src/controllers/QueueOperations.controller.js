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

const callNextCustomer = async (req, res) => {
  const { queueId } = req.params;
  let session;
  try {
    const queue = await getQueueUsingId(queueId);
    if (queue.status !== "OPEN") {
      return res.status(400).json({
        message: "Queue is not open for calling next customer",
      });
    }
    if (queue.currentServing !== null) {
      return res.status(409).json({
        message: "There is already a customer being served",
      });
    }
    session = await mongoose.startSession();
    session.startTransaction();
    const nextCustomer = await QueueEntry.findOneAndUpdate(
      {
        queueId,
        status: "WAITING",
      },
      {
        status: "CALLED",
        calledAt: new Date(),
      },
      {
        sort: {
          tokenNumber: 1,
        },
        returnDocument: "after",
        session,
      },
    );
    if (!nextCustomer) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({
        message: "No waiting customer found",
      });

    }
    const updatedQueue = await Queue.findOneAndUpdate(
      {
        _id: queueId,
        status: "OPEN",
        currentServing: null,
      },
      {
        currentServing: nextCustomer._id,
      },
      {
        returnDocument: "after",
        session,
      },
    );
    if(!updatedQueue) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(409).json({
        message: "Another staff member has already called the next customer.",
      });
    }

    await session.commitTransaction();
    await session.endSession();
    return res.status(200).json({
      message: "Next customer called successfully",
      nextCustomer,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      await session.endSession();
    }
    return res.status(500).json({
      message: "Error calling next customer",
      error: error.message,
    });
  }
};

const serveCustomer = async (req, res) => {
  const { queueId } = req.params;
  let session;
  try{
    const queue = await getQueueUsingId(queueId);
    if(queue.status !== "OPEN") {
      return res.status(400).json({
        message: "Queue is not open for serving customer",
      });
    }
    if(queue.currentServing === null) {
      return res.status(400).json({
        message: "No customer is currently being served",
      });
    }
    session = await mongoose.startSession();
    session.startTransaction();
    const updatedQueueEntry = await QueueEntry.findOneAndUpdate(
      {
        _id: queue.currentServing,
        status: "CALLED",
      },
      {
        status: "SERVED",
        servedAt: new Date(),
        servedBy: req.user._id,
      },
      {
        returnDocument: "after",
        session,
      }
    );
    if(!updatedQueueEntry) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({
        message: "No customer is currently being served",
      });
    }
    queue.currentServing = null;
    await queue.save({session});
    await session.commitTransaction();
    await session.endSession();
    return res.status(200).json({
      message: "Customer served successfully",
      servedCustomer: updatedQueueEntry,
    });
  }
    catch (error) {
      if (session) {
        await session.abortTransaction();
        await session.endSession();
      }
      return res.status(500).json({
        message: "Error serving customer",
        error: error.message,
      });
    }
}

const skipCustomer = async (req, res) => {
  const { queueId } = req.params;
  let session;
  try {
    const queue = await getQueueUsingId(queueId);
    if (queue.status !== "OPEN") {
      return res.status(400).json({
        message: "Queue is not open for skipping customer",
      });
    }
    if (queue.currentServing === null) {
      return res.status(400).json({
        message: "No customer is currently being served",
      });
    }
    session = await mongoose.startSession();
    session.startTransaction();
    const updatedQueueEntry = await QueueEntry.findOneAndUpdate(
      {
        _id: queue.currentServing,
        status: "CALLED",
      },
      {
        status: "SKIPPED",
      },
      {
        returnDocument: "after",
        session,
      },
    );
    if (!updatedQueueEntry) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({
        message: "No customer is currently being served",
      });
    }
    queue.currentServing = null;
    await queue.save({ session });
    await session.commitTransaction();
    await session.endSession();
    return res.status(200).json({
      message: "Customer skipped successfully",
      skippedCustomer: updatedQueueEntry,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      await session.endSession();
    }
    return res.status(500).json({
      message: "Error skipping customer",
      error: error.message,
    });
  }
};

const cancelEntry = async (req, res) => {
  const { queueId, entryId } = req.params;
  let session;
  try{
    const queue = await getQueueUsingId(queueId);
    const queueEntry = await QueueEntry.findOne({
      _id: entryId,
      queueId: queueId,
    });
    if(!queueEntry) {
      return res.status(404).json({
        message: "Queue entry not found",
      });
    }
    if(TERMINAL_QUEUE_STATUSES.includes(queueEntry.status)) {
      return res.status(400).json({
        message: "Queue entry is already in a terminal status",
      });
    }
    if(queueEntry.status != "WAITING") {
      return res.status(400).json({
        message: "Only waiting customers can be cancelled",
      });
    }
    queueEntry.status = "CANCELLED";
    await queueEntry.save();
    return res.status(200).json({
      message: "Queue entry cancelled successfully",
      cancelledEntry: queueEntry,
    });
  }catch (error) {
    return res.status(500).json({
      message: "Error cancelling queue entry",
      error: error.message,
    });
  }

}



export { joinQueue, callNextCustomer, serveCustomer, skipCustomer, cancelEntry };
