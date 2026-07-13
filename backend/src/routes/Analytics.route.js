import {Router} from "express";
import { getAnalytics } from "../controllers/Analytics.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/roles.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, authorizeRoles("MANAGER"), getAnalytics);

export default router;