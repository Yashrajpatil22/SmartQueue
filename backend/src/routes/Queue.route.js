import {
  createQueue,
  getQueueFromId,
  getAllQueues,
  deleteQueue,
  updateQueue,
  joinQueue,
} from "../controllers/Queue.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/roles.middleware.js";
import {Router} from "express";

const router = Router();

router.route("/").post(verifyJWT, authorizeRoles("MANAGER"), createQueue);
router.route("/:queueId").get(verifyJWT,authorizeRoles("MANAGER"), getQueueFromId);
router.route("/").get(verifyJWT, authorizeRoles("MANAGER"), getAllQueues);
router.route("/:queueId").delete(verifyJWT, authorizeRoles("MANAGER"), deleteQueue);
router.route("/:queueId").put(verifyJWT, authorizeRoles("MANAGER"), updateQueue);

router.route("/:queueId/join").post(joinQueue);

export default router;