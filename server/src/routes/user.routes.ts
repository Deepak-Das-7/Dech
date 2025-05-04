import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getAllUsers, getUserProfile } from "../controllers/user.controller";

const router = Router();

router.get("/", authMiddleware, getAllUsers);
// router.get("/", getAllUsers);
router.get("/:id", authMiddleware, getUserProfile);

export default router;
