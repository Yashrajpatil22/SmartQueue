import { createQueue } from "../controllers/Queue.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/roles.middleware.js";
import {Router} from "express";

const router = Router();

router.route("/").post(verifyJWT, authorizeRoles("MANAGER"), createQueue);

export default router;