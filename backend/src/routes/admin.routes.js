import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import {
  getRequests,
  approveRequest
} from "../controllers/authorRequest.controller.js";

const router = express.Router();

router.get(
  "/author-requests",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getRequests
);

router.patch(
  "/author-requests/:id/approve",
  authMiddleware,
  roleMiddleware("ADMIN"),
  approveRequest
);

export default router;