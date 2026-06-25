import prisma from "../config/prisma.js";


export const likeBlog = async (req, res) => {
    try {
        const existingLike = await prisma.like.findFirst({
            where: { userId: req.user.id, blogId: req.params.id }
        });

        if (existingLike) {
            return res.status(400).json({ success: false, message: "Already liked" });
        }

        // Use transaction to keep the counter in sync
        await prisma.$transaction([
            prisma.like.create({
                data: { userId: req.user.id, blogId: req.params.id }
            }),
            prisma.blog.update({
                where: { id: req.params.id },
                data: { likes: { increment: 1 } }
            })
        ]);

        res.status(201).json({ success: true, message: "Blog liked" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const unlikeBlog = async (req, res) => {
    try {
        const like = await prisma.like.findFirst({
            where: { userId: req.user.id, blogId: req.params.id }
        });

        if (!like) {
            return res.status(404).json({ success: false, message: "Like not found" });
        }

        // Use transaction to keep the counter in sync
        await prisma.$transaction([
            prisma.like.delete({ where: { id: like.id } }),
            prisma.blog.update({
                where: { id: req.params.id },
                data: { likes: { decrement: 1 } }
            })
        ]);

        res.status(200).json({ success: true, message: "Like removed" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getLikes = async (req, res) => {
    try {
        const likes = await prisma.like.findMany({
            where: { userId: req.user.id },
            select: { blogId: true }
        });

        res.json({ success: true, likedBlogIds: likes.map(l => l.blogId) });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Check if user liked a specific blog
export const checkLike = async (req, res) => {
    try {
        const like = await prisma.like.findFirst({
            where: { userId: req.user.id, blogId: req.params.id }
        });

        res.json({ success: true, liked: !!like });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};