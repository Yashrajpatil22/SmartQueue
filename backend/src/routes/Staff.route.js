import {Router} from "express";
import { createStaff } from "../controllers/Staff.controller.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create").post(authenticateUser, createStaff);

export default router;