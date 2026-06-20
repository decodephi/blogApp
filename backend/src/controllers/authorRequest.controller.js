import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";



dotenv.config();



// request for the uuser toupdate author

export const createRequest = async (req, res) => {

    const existing = await prisma.authorRequest.findUnique({
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

    console.log("Inside getRequests");

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




