import prisma from "../config/prisma.js";


// Add Bookmark
export const addBookmark = async (req, res) => {
    try {
        const existing = await prisma.bookmark.findFirst({
            where: { userId: req.user.id, blogId: req.params.id }
        });

        if (existing) {
            return res.status(400).json({ success: false, message: "Blog already bookmarked" });
        }

        const bookmark = await prisma.bookmark.create({
            data: { userId: req.user.id, blogId: req.params.id }
        });

        res.status(201).json({ success: true, message: "Blog bookmarked", bookmark });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Remove Bookmark
export const removeBookmark = async (req, res) => {
    try {
        const bookmark = await prisma.bookmark.findFirst({
            where: { userId: req.user.id, blogId: req.params.id }
        });

        if (!bookmark) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }

        await prisma.bookmark.delete({ where: { id: bookmark.id } });

        res.status(200).json({ success: true, message: "Bookmark removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get My Bookmarks (returns array with blogId for UI checks)
export const getBookmarks = async (req, res) => {
    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: req.user.id },
            select: {
                id: true,
                blogId: true,
                createdAt: true,
                blog: {
                    select: {
                        id: true, title: true, slug: true,
                        coverImage: true, category: true,
                        views: true, likes: true, createdAt: true,
                        author: { select: { id: true, name: true } }  // FIXED: no password
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        res.status(200).json(bookmarks);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};