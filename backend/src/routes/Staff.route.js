import {Router} from "express";
import {
  createStaff,
  getStaffById,
  getAllStaff,
} from "../controllers/Staff.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/roles.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, authorizeRoles("MANAGER"), createStaff);
router.route("/:staffId").get(verifyJWT, authorizeRoles("MANAGER"), getStaffById);
router.route("/").get(verifyJWT, authorizeRoles("MANAGER"), getAllStaff);

export default router;