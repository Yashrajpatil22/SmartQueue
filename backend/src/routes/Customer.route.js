import Route from "express";
import { getQueueDetails, getQueueEntryStatus } from "../controllers/Customer.controller.js";

const router = Route.Router();

router.route("/:queueId").get(getQueueDetails);
router.route("/entry/:entryId").get(getQueueEntryStatus);

export default router;