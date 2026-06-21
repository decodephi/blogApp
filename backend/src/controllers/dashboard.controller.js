export const getStats = async (req, res) => {

    const blogs = await prisma.blog.count({

        where: {
            authorId: req.user.id
        }

    });

    const views = await prisma.blog.aggregate({

        where: {
            authorId: req.user.id
        },

        _sum: {
            views: true
        }

    });

    res.json({

        totalBlogs: blogs,

        totalViews:
            views._sum.views || 0

    });

};