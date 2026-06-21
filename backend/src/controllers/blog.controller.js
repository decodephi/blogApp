
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

        const { title, content } = req.body;


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
                coverImage: imageUrl,
                authorId: req.user.id
            }
        });

        res.status(201).json(blog);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getBlogs = async (req, res) => {

    const blogs = await prisma.blog.findMany({
        where: {
            status: "PUBLISHED"
        },

        include: {
            author: true
        }
    })
    res.json(blogs);
}


export const getMyBlogs =
    async (req, res) => {

        const blogs = await prisma.blog.findMany({

            where: {
                authorId: req.user.id
            }

        });

        res.json(blogs);
    };



export const updateBlog = async (req, res) => {

        const blog = await prisma.blog.update({

            where: {
                id: req.params.id
            },

             data:{
   views:{
     increment:1
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