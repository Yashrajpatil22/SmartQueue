import {Router} from "express";
import { createStaff } from "../controllers/Staff.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/roles.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, authorizeRoles("MANAGER"), createStaff);

export default router;