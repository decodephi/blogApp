import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
    getRequests,
    approveRequest,
    rejectRequest
} from "../controllers/authorRequest.controller.js";

const router = express.Router();

// All admin routes require auth + ADMIN role
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

router.patch(
    "/author-requests/:id/reject",
    authMiddleware,
    roleMiddleware("ADMIN"),
    rejectRequest
);

export default router;