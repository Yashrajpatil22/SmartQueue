import { Router } from "express";
import { createTenant, login } from "../controllers/Auth.controller.js";

const router = Router();

router.route("/register").post(createTenant);
router.route("/login").post(login);

export default router;