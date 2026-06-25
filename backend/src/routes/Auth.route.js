import { Router } from "express";
import {
  createTenant,
  login,
  refreshAccessToken,
  logout,
} from "../controllers/Auth.controller.js";

const router = Router();

router.route("/register").post(createTenant);
router.route("/login").post(login);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(logout);

export default router;