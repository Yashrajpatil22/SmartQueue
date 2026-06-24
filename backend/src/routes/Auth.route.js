import { Router } from "express";
import { createTenant } from "../controllers/Auth.controller.js";

const router = Router();

router.route("/register").post(createTenant);

export default router;