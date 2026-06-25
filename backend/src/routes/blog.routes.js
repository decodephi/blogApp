import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';
import upload from "../middleware/upload.middleware.js";
import {
    createBlog,
    getBlogs,
    getMyBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    publishBlog,
    incrementView,
    getBlogBySlug,
    getSummary,
    searchBlogs,
    getBlogsByCategory,
    getTrendingBlogs,
    getRelatedBlogs
} from '../controllers/blog.controller.js';

const router = express.Router();

// ─── Static / Specific Routes FIRST (before /:id) ─────────────────────────────
// CRITICAL: Express matches in order — these MUST come before any /:id route

router.get('/my-blogs', authMiddleware, getMyBlogs);
router.get('/search', searchBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/category/:category', getBlogsByCategory);

// ─── Base Routes ───────────────────────────────────────────────────────────────

router.get('/', getBlogs);

router.post(
    '/',
    authMiddleware,
    roleMiddleware("AUTHOR", "ADMIN"),
    upload.single("image"),
    createBlog
);

// ─── Dynamic ID Routes (AFTER static routes) ──────────────────────────────────

router.get('/:id', getBlogById);
router.get('/:id/summary', getSummary);
router.get('/:id/related', getRelatedBlogs);

router.post('/:id/view', incrementView);

router.put(
    '/:id',
    authMiddleware,
    upload.single("image"),
    updateBlog
);

router.delete('/:id', authMiddleware, deleteBlog);

router.patch(
    '/:id/publish',
    authMiddleware,
    roleMiddleware("AUTHOR", "ADMIN"),   // FIXED: Admin can also publish
    publishBlog
);

export default router;