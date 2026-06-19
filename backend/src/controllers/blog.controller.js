
import prisma from '../config/prisma.js';



export const createBlog = async (req, res) => {

    try {

        const { title, content } = req.body;

        const blog = await prisma.blog.create({ data: { title, content, author: req.user.id } });

        res.status(201).json(blog);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}