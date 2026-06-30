import {
  joinQueue,
  callNextCustomer,
  serveCustomer,
  
} from "../controllers/QueueOperations.controller.js";
import {Router} from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/roles.middleware.js";

const router = Router();

router.route("/:queueId/join").post(joinQueue);
router.route("/:queueId/call-next").post(verifyJWT, authorizeRoles("MANAGER","STAFF"), callNextCustomer);
router.route("/:queueId/serve").post(verifyJWT, authorizeRoles("MANAGER","STAFF"), serveCustomer);

export default router;