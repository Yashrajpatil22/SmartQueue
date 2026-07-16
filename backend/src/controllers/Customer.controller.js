import Queue from "../models/Queue.model.js";
import QueueEntry from "../models/QueueEntry.model.js";
import mongoose from "mongoose";
import { getQueueUsingId } from "../utils/getQueue.js";

const getQueueDetails = async (req, res) => {
  const { queueId } = req.params;
  try{
    const queue = await (await getQueueUsingId(queueId)).populate("tenantId");
    res.status(200).json({ queueName: queue.name, businessName: queue.tenantId.name });
  }
  catch(error){
    console.error("Error fetching queue details:", error);
    res.status(500).json({ message: "Failed to fetch queue details." });
  }
};

export { getQueueDetails };