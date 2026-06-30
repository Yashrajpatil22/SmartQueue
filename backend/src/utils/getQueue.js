import Queue from "../models/Queue.model.js";
import mongoose from "mongoose";

const getQueue = async (tenantId, queueId) => {
    if (!mongoose.Types.ObjectId.isValid(queueId)) {
        throw new Error("Invalid queue ID");
    }
    const queue = await Queue.findOne({
        _id: queueId,
        tenantId: tenantId,
    });
    if (!queue) {
        throw new Error("Queue not found");
    }
    return queue;

}

const getQueueUsingId = async (queueId) => {
    if (!mongoose.Types.ObjectId.isValid(queueId)) {
        throw new Error("Invalid queue ID");
    }
    const queue = await Queue.findById(queueId);
    if (!queue) {
        throw new Error("Queue not found");
    }
    return queue;
}

export { getQueue, getQueueUsingId };