import Queue from "../models/Queue.model.js";
import mongoose from "mongoose";
import getQueue from "../utils/getQueue.js";

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
        const queue = await getQueue(manager.tenantId, queueId);
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
    const { limit="5", page="1" } = req.query;
    const pageNumber = Number.parseInt(page);
    const limitNumber = Number.parseInt(limit);
    if(isNaN(pageNumber) || pageNumber <= 0 || isNaN(limitNumber) || limitNumber <= 0){
        return res.status(400).json({ message: "Invalid page or limit values" });
    }
    const skip = (pageNumber - 1) * limitNumber;

    let {sort, order} = req.query;
    sort ??= "createdAt";
    order ??= sort === "name" ? "asc" : "desc"; 
    const allowedSortFields = ["name", "createdAt", "updatedAt"];
    const allowedOrderValues = ["asc", "desc"];
    if (
      (!allowedSortFields.includes(sort)) ||
      (!allowedOrderValues.includes(order))
    ) {
      return res.status(400).json({ message: "Invalid sort or order values" });
    }
    const direction = order === "asc" ? 1 : -1;

    const {search} = req.query;
    const filter = {
        tenantId: manager.tenantId,
    }

    try{
        const sortQuery = {[sort]: direction};
        if(search) {
            filter.name = { $regex: search, $options: "i" };
        }
        const queues = await Queue.find(filter)
          .sort(sortQuery)
          .skip(skip)
          .limit(limitNumber);
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
        const queue = await getQueue(manager.tenantId, queueId);
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

const updateQueue = async (req, res) => {
    const { queueId } = req.params;
    const manager = req.user;
    const name = req.body.name?.trim() ?? "";
    const description = req.body.description?.trim() ?? "";

    if (!mongoose.Types.ObjectId.isValid(queueId)) {
        return res.status(400).json({
            message: "Invalid queue ID",
        });
    }
    if(!name && !description) {
        return res.status(400).json({
            message: "At least one field (name or description) is required to update",
        });
    }
    try{
        const queue = await getQueue(manager.tenantId, queueId);
        if (!queue) {
            return res.status(404).json({
                message: "Queue not found",
            });
        }
        if(name){
            const existingQueue = await Queue.findOne({
                name,
                tenantId: manager.tenantId
            });
            if(existingQueue && !existingQueue._id.equals(queueId)) {
                return res.status(400).json({
                    message: "Queue with this name already exists",
                });
            }
            queue.name = name;

        }
        if(description){
            queue.description = description;
            
        }
        await queue.save();
        return res.status(200).json({
            message: "Queue updated successfully",
            queue,
        });
    }catch (error) {
        return res.status(500).json({
            message: "Error updating queue",
            error: error.message,
        });
    }
}

export { createQueue, getQueueFromId, getAllQueues, deleteQueue, updateQueue };
