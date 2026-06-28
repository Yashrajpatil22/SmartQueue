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

export { createQueue };
