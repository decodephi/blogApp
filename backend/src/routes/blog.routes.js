import express from 'express'
console.log("blog route loaded")

const router = express.Router()

import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';
import {
  createBlog,
  getBlogs,
  getMyBlogs,
  updateBlog,
  deleteBlog,
  publishBlog,
  getBlogBySlug
} from '../controllers/blog.controller.js';
import upload from "../middleware/upload.middleware.js";


router.post('/', authMiddleware,
  roleMiddleware(
    "AUTHOR",
    "ADMIN"
  ),
  upload.single("image"),
  createBlog)


router.get('/', getBlogs);


router.get(
  "/my-blogs",
  authMiddleware,
  getMyBlogs
);


router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  updateBlog
);


router.delete(
  "/:id",
  authMiddleware,
  deleteBlog
);


router.patch(
  "/:id/publish",
  authMiddleware,
  roleMiddleware("AUTHOR"),
  publishBlog
);

router.get(
  "/slug/:slug",
  getBlogBySlug
);



export default router;