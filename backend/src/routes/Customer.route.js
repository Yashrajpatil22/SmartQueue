import Route from "express";
import { getQueueDetails } from "../controllers/Customer.controller.js";

const router = Route.Router();

router.route("/:queueId").get(getQueueDetails);

export default router;