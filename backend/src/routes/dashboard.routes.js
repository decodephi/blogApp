import express from "express";

import authMiddleware
from "../middleware/auth.middleware.js";

import {
    getStats
}
from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get(
    "/stats",
    authMiddleware,
    getStats
);

export default router;