import prisma from "../config/prisma.js";


// Add Comment
export const addComment = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: "Comment cannot be empty" });
        }

        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                userId: req.user.id,
                blogId: req.params.blogId
            },
            include: {
                user: { select: { id: true, name: true } }  // FIXED: no password
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Reply to a Comment
export const replyComment = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: "Reply cannot be empty" });
        }

        // Verify the parent comment exists
        const parent = await prisma.comment.findUnique({
            where: { id: req.params.commentId }
        });

        if (!parent) {
            return res.status(404).json({ success: false, message: "Parent comment not found" });
        }

        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                userId: req.user.id,
                blogId: req.params.blogId,
                parentId: req.params.commentId
            },
            include: {
                user: { select: { id: true, name: true } }  // FIXED: no password
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get All Top-Level Comments with Replies
export const getComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                blogId: req.params.blogId,
                parentId: null  // only top-level
            },
            include: {
                user: { select: { id: true, name: true } },   // FIXED: no password
                replies: {
                    include: {
                        user: { select: { id: true, name: true } }  // FIXED: no password
                    },
                    orderBy: { createdAt: "asc" }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Delete Comment (owner or admin only)
export const deleteComment = async (req, res) => {
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: req.params.id }
        });

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        if (comment.userId !== req.user.id && req.user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Not authorized to delete this comment" });
        }

        // Delete replies first, then the comment
        await prisma.$transaction([
            prisma.comment.deleteMany({ where: { parentId: req.params.id } }),
            prisma.comment.delete({ where: { id: req.params.id } })
        ]);

        res.status(200).json({ success: true, message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};