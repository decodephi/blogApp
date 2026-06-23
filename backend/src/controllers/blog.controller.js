
import prisma from '../config/prisma.js';
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import { generateSummary } from "../services/summary.service.js";



export const createBlog = async (req, res) => {

    try {

        let imageUrl = "";

        if (req.file) {

            const result =
                await cloudinary.uploader.upload(
                    req.file.path
                );

            imageUrl =
                result.secure_url;
        }

        const { title, content, category } = req.body;


        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }


        const slug = slugify(title, {
            lower: true,
            strict: true
        });


        const blog = await prisma.blog.create({
            data: {
                title,
                content,
                slug,
                category,
                coverImage: imageUrl,
                authorId: req.user.id
            }
        });

        res.status(201).json(blog);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



export const getBlogs =
    async (req, res) => {

        const page =
            Number(req.query.page) || 1;

        const limit =
            Number(req.query.limit) || 10;

        const skip =
            (page - 1) * limit;

        const blogs =
            await prisma.blog.findMany({

                where: {
                    status: "PUBLISHED"
                },

                skip,

                take: limit,

                orderBy: {
                    createdAt: "desc"
                }

            });

        res.json(blogs);

    };

export const getMyBlogs = async (req, res) => {

    try {

        const blogs = await prisma.blog.findMany({

            where: {
                authorId: req.user.id
            }

        });

        res.status(200).json(blogs);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const updateBlog = async (req, res) => {

    const blog = await prisma.blog.update({

        where: {
            id: req.params.id
        },

        data: {
            views: {
                increment: 1
            }
        }

    });

    res.json(blog);

};


export const deleteBlog =
    async (req, res) => {

        await prisma.blog.delete({

            where: {
                id: req.params.id
            }

        });

        res.json({
            message: "Deleted"
        });

    };


export const publishBlog = async (req, res) => {

    const existingBlog = await prisma.blog.findUnique({

        where: {
            id: req.params.id
        }

    });

    const summary = await generateSummary(
        existingBlog.content
    );

    const blog = await prisma.blog.update({

        where: {
            id: req.params.id
        },

        data: {
            status: "PUBLISHED",
            summary
        }

    });

    res.json(blog);

};



export const getBlogBySlug = async (req, res) => {

    const blog = await prisma.blog.findUnique({
        where: {
            slug: req.params.slug
        },

        include: {
            author: true
        }
    });

    res.json(blog);
};

export const getSummary = async (req, res) => {

    const blog =
        await prisma.blog.findUnique({

            where: {
                id: req.params.id
            },

            select: {
                summary: true
            }

        });

    res.json(blog);

};



export const searchBlogs =
    async (req, res) => {

        try {

            const { q } = req.query;

            const blogs =
                await prisma.blog.findMany({

                    where: {
                        status: "PUBLISHED",

                        OR: [
                            {
                                title: {
                                    contains: q
                                }
                            },

                            {
                                content: {
                                    contains: q
                                }
                            }
                        ]
                    }

                });

            res.json(blogs);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    };


export const getBlogsByCategory =
    async (req, res) => {

        const blogs =
            await prisma.blog.findMany({

                where: {
                    status: "PUBLISHED",

                    category:
                        req.params.category
                }

            });

        res.json(blogs);

    };


export const getTrendingBlogs =
    async (req, res) => {

        const blogs =
            await prisma.blog.findMany({

                where: {
                    status: "PUBLISHED"
                },

                orderBy: [
                    {
                        views: "desc"
                    }
                ],

                take: 5

            });

        res.json(blogs);

    };



export const getRelatedBlogs =
    async (req, res) => {

        const blog =
            await prisma.blog.findUnique({

                where: {
                    id: req.params.id
                }

            });

        const related =
            await prisma.blog.findMany({

                where: {

                    category:
                        blog.category,

                    NOT: {
                        id: blog.id
                    }

                },

                take: 4

            });

        res.json(related);

    };