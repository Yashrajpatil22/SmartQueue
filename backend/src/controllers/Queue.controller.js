import Queue from "../models/Queue.model.js";
import mongoose from "mongoose";

const createQueue = async (req, res) => {
  const manager = req.user;
  const name = req.body.name?.trim();
  const description = req.body.description?.trim();

  if (!name) {
    return res.status(400).json({
      message: "Queue name is required",
    });
  }
  try {
    const existingQueue = await Queue.findOne({
      name,
      tenantId: manager.tenantId,
    });
    if (existingQueue) {
        return res.status(400).json({
          message: "Queue with this name already exists",
        });
    }
    const queue = await Queue.create({
      name,
      description,
      tenantId: manager.tenantId,
      createdBy: manager._id,
    });
    return res.status(201).json({
      message: "Queue created successfully",
      queue,
    });
  } catch (error) {
    if(error.code === 11000) {

    const duplicatedField = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `Queue with this ${duplicatedField} already exists`    ,
      });
    }
    return res.status(500).json({
      message: "Error creating queue",
      error: error.message,
    });
  }
};

const getQueueFromId = async (req, res) => {
    const { queueId } = req.params;
    const manager = req.user;

    if (!mongoose.Types.ObjectId.isValid(queueId)) {
        return res.status(400).json({
            message: "Invalid queue ID",
        });
    }
    try{
        const queue = await Queue.findOne({
            _id: queueId,
            tenantId: manager.tenantId,
        });
        if (!queue) {
            return res.status(404).json({
                message: "Queue not found",
            });
        }
        return res.status(200).json({
            message: "Queue found",
            queue,
        });
    }catch (error) {
        return res.status(500).json({
            message: "Error fetching queue",
            error: error.message,
        });
    }

}

const getAllQueues = async (req, res) => {
    const manager = req.user;
    try{
        const queues = await Queue.find({
            tenantId: manager.tenantId,
        });
        return res.status(200).json({
            message: "Queues found",
            queues,
        });
    }catch (error) {
        return res.status(500).json({
            message: "Error fetching queues",
            error: error.message,
        });
    }
}

const deleteQueue = async (req, res) => {
    const { queueId } = req.params;
    const manager = req.user;

    if (!mongoose.Types.ObjectId.isValid(queueId)) {
        return res.status(400).json({
            message: "Invalid queue ID",
        });
    }
    try{
        const queue = await Queue.findOne({
            _id: queueId,
            tenantId: manager.tenantId,
        });
        if (!queue) {
            return res.status(404).json({
                message: "Queue not found",
            });
        }
        await queue.deleteOne();
        return res.status(200).json({
            message: "Queue deleted successfully",
        });
    }catch (error) {
        return res.status(500).json({
            message: "Error deleting queue",
            error: error.message,
        });
    }
}

export { createQueue, getQueueFromId, getAllQueues, deleteQueue };
