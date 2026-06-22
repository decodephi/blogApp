import prisma from "../config/prisma.js";



///Add Comment
export const addComment = async (req, res) => {

    try {

        const { content } = req.body;

        const comment =
            await prisma.comment.create({

                data: {

                    content,

                    userId: req.user.id,

                    blogId: req.params.blogId

                }

            });

        res.status(201).json(comment);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Reply To Comment

export const replyComment = async (req, res) => {

    try {

        const { content } = req.body;

        const comment =
            await prisma.comment.create({

                data: {

                    content,

                    userId: req.user.id,

                    blogId: req.params.blogId,

                    parentId: req.params.commentId

                }

            });

        res.status(201).json(comment);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Get Comments By Blog Id


export const getComments = async (req, res) => {

    try {

        const comments =
            await prisma.comment.findMany({

                where: {

                    blogId: req.params.blogId,

                    parentId: null

                },

                include: {

                    user: true,

                    replies: {

                        include: {
                            user: true
                        }

                    }

                }

            });

        res.status(200).json(comments);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Delete Comment


export const deleteComment = async (req, res) => {

    try {

        await prisma.comment.delete({

            where: {
                id: req.params.id
            }

        });

        res.status(200).json({
            message: "Comment deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};