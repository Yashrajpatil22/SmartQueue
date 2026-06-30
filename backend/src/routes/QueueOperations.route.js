import {
  joinQueue,
  callNextCustomer,
  serveCustomer,
  skipCustomer,
  
} from "../controllers/QueueOperations.controller.js";
import {Router} from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/roles.middleware.js";

const router = Router();

router.route("/:queueId/join").post(joinQueue);
router.route("/:queueId/call-next").post(verifyJWT, authorizeRoles("MANAGER","STAFF"), callNextCustomer);
router.route("/:queueId/serve").post(verifyJWT, authorizeRoles("MANAGER","STAFF"), serveCustomer);
router.route("/:queueId/skip").post(verifyJWT, authorizeRoles("MANAGER","STAFF"), skipCustomer);

export default router;