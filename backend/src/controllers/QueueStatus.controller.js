import Queue from "../models/Queue.model.js";
import mongoose from "mongoose";
import QueueEntry from "../models/QueueEntry.model.js";
import {
  QUEUE_ENTRY_STATUS,
  ACTIVE_QUEUE_STATUSES,
  TERMINAL_QUEUE_STATUSES,
} from "../constants/queueStatus.js";
import { getQueueUsingId } from "../utils/getQueue.js";