import prisma from '../config/prisma.js';
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import { generateSummary } from "../services/summary.service.js";


// ─── Create Blog ─────────────────────────────────────────────────────────────

export const createBlog = async (req, res) => {
    try {
        let imageUrl = "";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const { title, content, category } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        // Generate unique slug — append timestamp if title slug already exists
        let slug = slugify(title, { lower: true, strict: true });
        const existing = await prisma.blog.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        const blog = await prisma.blog.create({
            data: {
                title,
                content,
                slug,
                category: category || null,
                coverImage: imageUrl || null,
                authorId: req.user.id
            }
        });

        res.status(201).json({ success: true, blog });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Get All Published Blogs (with pagination) ───────────────────────────────

export const getBlogs = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const [blogs, total] = await Promise.all([
            prisma.blog.findMany({
                where: { status: "PUBLISHED" },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    summary: true,
                    content: true,
                    category: true,
                    coverImage: true,
                    views: true,
                    likes: true,
                    status: true,
                    createdAt: true,
                    author: {
                        select: { id: true, name: true, email: true }
                    }
                }
            }),
            prisma.blog.count({ where: { status: "PUBLISHED" } })
        ]);

        res.json({
            success: true,
            blogs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Get My Blogs ─────────────────────────────────────────────────────────────

export const getMyBlogs = async (req, res) => {
    try {
        const blogs = await prisma.blog.findMany({
            where: { authorId: req.user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                slug: true,
                summary: true,
                category: true,
                coverImage: true,
                views: true,
                likes: true,
                status: true,
                createdAt: true
            }
        });

        res.status(200).json({ success: true, blogs });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Get Single Blog By ID ────────────────────────────────────────────────────

export const getBlogById = async (req, res) => {
    try {
        const blog = await prisma.blog.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                summary: true,
                category: true,
                coverImage: true,
                views: true,
                likes: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                authorId: true,
                author: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        res.json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Update Blog ─────────────────────────────────────────────────────────────
// FIXED: now actually updates the blog content instead of just incrementing views

export const updateBlog = async (req, res) => {
    try {
        const blog = await prisma.blog.findUnique({
            where: { id: req.params.id }
        });

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Only the author or an admin can edit
        if (blog.authorId !== req.user.id && req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to edit this blog"
            });
        }

        let imageUrl = blog.coverImage;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const { title, content, category } = req.body;

        // Re-generate slug only if title changed
        let slug = blog.slug;
        if (title && title !== blog.title) {
            const newSlug = slugify(title, { lower: true, strict: true });
            const existing = await prisma.blog.findFirst({
                where: { slug: newSlug, NOT: { id: blog.id } }
            });
            slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
        }

        const updated = await prisma.blog.update({
            where: { id: req.params.id },
            data: {
                title: title || blog.title,
                content: content || blog.content,
                category: category !== undefined ? category : blog.category,
                coverImage: imageUrl,
                slug,
                // Reset to DRAFT if content changes significantly
                status: blog.status === "PUBLISHED" ? "DRAFT" : blog.status
            }
        });

        res.json({ success: true, blog: updated });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Delete Blog ──────────────────────────────────────────────────────────────

export const deleteBlog = async (req, res) => {
    try {
        const blog = await prisma.blog.findUnique({
            where: { id: req.params.id }
        });

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Only the author or an admin can delete
        if (blog.authorId !== req.user.id && req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this blog"
            });
        }

        // Delete related records first to avoid FK constraint errors
        await prisma.$transaction([
            prisma.like.deleteMany({ where: { blogId: req.params.id } }),
            prisma.bookmark.deleteMany({ where: { blogId: req.params.id } }),
            prisma.comment.deleteMany({ where: { blogId: req.params.id } }),
            prisma.blog.delete({ where: { id: req.params.id } })
        ]);

        res.json({ success: true, message: "Blog deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Publish Blog ─────────────────────────────────────────────────────────────

export const publishBlog = async (req, res) => {
    try {
        const existingBlog = await prisma.blog.findUnique({
            where: { id: req.params.id }
        });

        if (!existingBlog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Only the blog's author or admin can publish
        if (existingBlog.authorId !== req.user.id && req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to publish this blog"
            });
        }

        let summary = existingBlog.summary || "";
        if (!summary) {
            try {
                summary = await generateSummary(existingBlog.content);
            } catch (summaryError) {
                console.error("Summary generation failed:", summaryError.message);
                summary = existingBlog.content.substring(0, 300) + "...";
            }
        }

        const blog = await prisma.blog.update({
            where: { id: req.params.id },
            data: { status: "PUBLISHED", summary }
        });

        res.json({ success: true, blog });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Increment View Count ─────────────────────────────────────────────────────

export const incrementView = async (req, res) => {
    try {
        await prisma.blog.update({
            where: { id: req.params.id },
            data: { views: { increment: 1 } }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Get Blog By Slug ─────────────────────────────────────────────────────────

export const getBlogBySlug = async (req, res) => {
    try {
        const blog = await prisma.blog.findUnique({
            where: { slug: req.params.slug },
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                summary: true,
                category: true,
                coverImage: true,
                views: true,
                likes: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                authorId: true,
                author: {
                    // FIXED: select specific fields, do NOT include password
                    select: { id: true, name: true, email: true }
                }
            }
        });

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        res.json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Get AI Summary ───────────────────────────────────────────────────────────

export const getSummary = async (req, res) => {
    try {
        const blog = await prisma.blog.findUnique({
            where: { id: req.params.id },
            select: { summary: true, content: true }
        });

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        let summary = blog.summary;

        if (!summary) {
            try {
                summary = await generateSummary(blog.content);
                await prisma.blog.update({
                    where: { id: req.params.id },
                    data: { summary }
                });
            } catch {
                summary = blog.content.substring(0, 300) + "...";
            }
        }

        res.json({ success: true, summary });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Search Blogs ─────────────────────────────────────────────────────────────

export const searchBlogs = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length === 0) {
            return res.json({ success: true, blogs: [] });
        }

        const blogs = await prisma.blog.findMany({
            where: {
                status: "PUBLISHED",
                OR: [
                    { title: { contains: q } },
                    { category: { contains: q } }
                ]
            },
            select: {
                id: true,
                title: true,
                slug: true,
                summary: true,
                content: true,
                category: true,
                coverImage: true,
                views: true,
                likes: true,
                createdAt: true,
                author: {
                    select: { id: true, name: true }
                }
            },
            take: 20
        });

        res.json({ success: true, blogs });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Get Blogs By Category ────────────────────────────────────────────────────

export const getBlogsByCategory = async (req, res) => {
    try {
        const blogs = await prisma.blog.findMany({
            where: {
                status: "PUBLISHED",
                category: req.params.category
            },
            select: {
                id: true,
                title: true,
                slug: true,
                summary: true,
                content: true,
                category: true,
                coverImage: true,
                views: true,
                likes: true,
                createdAt: true,
                author: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        res.json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Trending Blogs ───────────────────────────────────────────────────────────

export const getTrendingBlogs = async (req, res) => {
    try {
        const blogs = await prisma.blog.findMany({
            where: { status: "PUBLISHED" },
            orderBy: [{ views: "desc" }, { likes: "desc" }],
            take: 5,
            select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                coverImage: true,
                views: true,
                likes: true,
                createdAt: true,
                author: {
                    select: { id: true, name: true }
                }
            }
        });

        res.json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Related Blogs ────────────────────────────────────────────────────────────

export const getRelatedBlogs = async (req, res) => {
    try {
        const blog = await prisma.blog.findUnique({
            where: { id: req.params.id },
            select: { category: true }
        });

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        const related = await prisma.blog.findMany({
            where: {
                status: "PUBLISHED",
                category: blog.category,
                NOT: { id: req.params.id }
            },
            take: 4,
            select: {
                id: true,
                title: true,
                slug: true,
                coverImage: true,
                category: true,
                views: true,
                createdAt: true,
                author: {
                    select: { id: true, name: true }
                }
            }
        });

        res.json({ success: true, blogs: related });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};