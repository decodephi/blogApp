import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";
dotenv.config();




export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;


        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser =
            await prisma.user.findUnique({
                where: { email }
            });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user =
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword
                }
            });

        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user =
            await prisma.user.findUnique({
                where: { email }
            });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


export const getMe = async (req, res) => {
    try {

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// request for the uuser toupdate author

export const createRequest = async (req, res) => {

    const existing = await prisma.reaquest.findUnique({
        where: {
            userId: req.user.id
        }
    })


    if (existing) {
        return res.status(400).json({
            message: "you already have a pending request"
        })
    }


    const request = await prisma.authorRequest.create({
        data: {
            userId: req.user.id,
            status: "PENDING"
        }
    })

    res.status(201).json({
        message: "Request created successfully",
        request
    })
}



// admin view requests



export const getRequests = async (req, res) => {

    const requests = await prisma.authorRequest.findMany({

        include: {
            user: true
        }

    })


    res.status(200).json({
        message: "Requests fetched successfully",
        requests
    })
}

// approve request for author

export const approveRequest = async (req, res) => {



    const request = await prisma.authorRequest.findUnique({
        where: {
            id: req.params.id
        }
    })

    if (!request) {
        return res.status(404).json({
            message: "Request not found"
        })
    }

    await prisma.user.update({
        where: {
            id: request.userId
        },
        data: {
            role: "AUTHOR"
        }
    })

    await prisma.authorRequest.update({
        where: {
            id: req.params.id
        },
        data: {
            status: "APPROVED"
        }
    })

    res.status(200).json({
        message: "Request approved successfully"
    })

}