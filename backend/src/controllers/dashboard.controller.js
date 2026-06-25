import prisma from "../config/prisma.js";


export const getStats = async (req, res) => {
    try {
        const authorId = req.user.id;

        // Get all blog IDs for this author to count related records
        const authorBlogs = await prisma.blog.findMany({
            where: { authorId },
            select: { id: true }
        });

        const blogIds = authorBlogs.map(b => b.id);

        const [totalBlogs, publishedBlogs, draftBlogs, viewsAgg, totalLikes, totalBookmarks, totalComments] =
            await Promise.all([
                prisma.blog.count({ where: { authorId } }),
                prisma.blog.count({ where: { authorId, status: "PUBLISHED" } }),
                prisma.blog.count({ where: { authorId, status: "DRAFT" } }),
                prisma.blog.aggregate({
                    where: { authorId },
                    _sum: { views: true }
                }),
                prisma.like.count({ where: { blogId: { in: blogIds } } }),
                prisma.bookmark.count({ where: { blogId: { in: blogIds } } }),
                prisma.comment.count({ where: { blogId: { in: blogIds } } })
            ]);

        res.json({
            success: true,
            stats: {
                totalBlogs,
                publishedBlogs,
                draftBlogs,
                totalViews: viewsAgg._sum.views || 0,
                totalLikes,
                totalBookmarks,
                totalComments
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};