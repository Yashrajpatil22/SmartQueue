import {
  createQueue,
  getQueueFromId,
  getAllQueues,
  deleteQueue,
  updateQueue,
} from "../controllers/Queue.controller.js";
import {
  joinQueue,
  callNextCustomer,
  serveCustomer,
  skipCustomer,
  cancelEntry,
} from "../controllers/QueueOperations.controller.js";
import {
  queueStatus
} from "../controllers/QueueStatus.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/roles.middleware.js";
import {Router} from "express";

const router = Router();


// Queue Management Routes
router.route("/").post(verifyJWT, authorizeRoles("MANAGER"), createQueue);
router.route("/:queueId").get(verifyJWT,authorizeRoles("MANAGER"), getQueueFromId);
router.route("/").get(verifyJWT, authorizeRoles("MANAGER"), getAllQueues);
router.route("/:queueId").delete(verifyJWT, authorizeRoles("MANAGER"), deleteQueue);
router.route("/:queueId").put(verifyJWT, authorizeRoles("MANAGER"), updateQueue);

// Queue Operations Routes
router.route("/:queueId/join").post(joinQueue);
router
  .route("/:queueId/call-next")
  .post(verifyJWT, authorizeRoles("MANAGER", "STAFF"), callNextCustomer);
router
  .route("/:queueId/serve")
  .post(verifyJWT, authorizeRoles("MANAGER", "STAFF"), serveCustomer);
router
  .route("/:queueId/skip")
  .post(verifyJWT, authorizeRoles("MANAGER", "STAFF"), skipCustomer);

router.route("/:queueId/entry/:entryId/cancel")
  .post(cancelEntry);

// Queue Status Route
router.route("/:queueId/status").get(queueStatus);

export default router;