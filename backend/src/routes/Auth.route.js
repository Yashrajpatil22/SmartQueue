import { Router } from "express";
import {
  createTenant,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
} from "../controllers/Auth.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(createTenant);
router.route("/login").post(login);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(logout);
router.route("/me").get(verifyJWT,getCurrentUser);

export default router;