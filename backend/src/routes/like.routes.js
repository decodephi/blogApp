import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { likeBlog, unlikeBlog, getLikes, checkLike } from "../controllers/like.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getLikes);
router.get("/:id/check", authMiddleware, checkLike);
router.post("/:id", authMiddleware, likeBlog);
router.delete("/:id", authMiddleware, unlikeBlog);

export default router;