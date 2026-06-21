import prisma from "../config/prisma.js";

export const likeBlog = async (req, res) => {

    try {

        const existingLike =
            await prisma.like.findFirst({
                where: {
                    userId: req.user.id,
                    blogId: req.params.id
                }
            });

        if (existingLike) {
            return res.status(400).json({
                message: "Already liked"
            });
        }

        const like =
            await prisma.like.create({
                data: {
                    userId: req.user.id,
                    blogId: req.params.id
                }
            });

        await prisma.blog.update({
            where: {
                id: req.params.id
            },
            data: {
                likes: {
                    increment: 1
                }
            }
        });

        res.status(201).json({
            message: "Blog liked",
            like
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const unlikeBlog = async (req, res) => {

    try {

        const like =
            await prisma.like.findFirst({
                where: {
                    userId: req.user.id,
                    blogId: req.params.id
                }
            });

        if (!like) {
            return res.status(404).json({
                message: "Like not found"
            });
        }

        await prisma.like.delete({
            where: {
                id: like.id
            }
        });

        await prisma.blog.update({
            where: {
                id: req.params.id
            },
            data: {
                likes: {
                    decrement: 1
                }
            }
        });

        res.status(200).json({
            message: "Like removed"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const getLikes = async (req, res) => {

    try {

        const likes =
            await prisma.like.findMany({

                where: {
                    userId: req.user.id
                },

                include: {
                    blog: true
                }

            });

        res.json(likes);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};