import { Router } from "express";
import {
  createTenant,
  login,
  refreshAccessToken,
} from "../controllers/Auth.controller.js";

const router = Router();

router.route("/register").post(createTenant);
router.route("/login").post(login);
router.route("/refresh-token").post(refreshAccessToken);

export default router;