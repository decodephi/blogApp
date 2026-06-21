import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
    addBookmark,
    removeBookmark,
    getBookmarks
} from "../controllers/bookmark.controller.js";

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getBookmarks
);

router.post(
    "/:id",
    authMiddleware,
    addBookmark
);

router.delete(
    "/:id",
    authMiddleware,
    removeBookmark
);

export default router;