import prisma from "../config/prisma.js";


// Add Bookmark

export const addBookmark = async (req, res) => {

    try {

        const existingBookmark =
            await prisma.bookmark.findFirst({
                where: {
                    userId: req.user.id,
                    blogId: req.params.id
                }
            });

        if (existingBookmark) {
            return res.status(400).json({
                message: "Blog already bookmarked"
            });
        }

        const bookmark =
            await prisma.bookmark.create({
                data: {
                    userId: req.user.id,
                    blogId: req.params.id
                }
            });

        res.status(201).json({
            message: "Blog bookmarked successfully",
            bookmark
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};



// Remove Bookmark

export const removeBookmark = async (req, res) => {

    try {

        const bookmark =
            await prisma.bookmark.findFirst({
                where: {
                    userId: req.user.id,
                    blogId: req.params.id
                }
            });

        if (!bookmark) {
            return res.status(404).json({
                message: "Bookmark not found"
            });
        }

        await prisma.bookmark.delete({
            where: {
                id: bookmark.id
            }
        });

        res.status(200).json({
            message: "Bookmark removed successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};



// Get My Bookmarks

export const getBookmarks = async (req, res) => {

    try {

        const bookmarks =
            await prisma.bookmark.findMany({

                where: {
                    userId: req.user.id
                },

                include: {
                    blog: {
                        include: {
                            author: true
                        }
                    }
                }

            });

        res.status(200).json(bookmarks);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};