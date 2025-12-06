import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getMessagesBetweenUsers,
  getUserForSidebar,
  sendMessageToUser,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectedRoute, getUserForSidebar);
router.get("/:id", protectedRoute, getMessagesBetweenUsers);
router.post("/send/:id", protectedRoute, sendMessageToUser);
export default router;
