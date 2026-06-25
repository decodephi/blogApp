import prisma from "../config/prisma.js";


// ─── Create Author Request ─────────────────────────────────────────────────────

export const createRequest = async (req, res) => {
    try {
        // Already an author or admin — no need to request
        if (req.user.role === "AUTHOR" || req.user.role === "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "You are already an author or admin"
            });
        }

        const existing = await prisma.authorRequest.findUnique({
            where: { userId: req.user.id }
        });

        if (existing) {
            if (existing.status === "PENDING") {
                return res.status(400).json({
                    success: false,
                    message: "You already have a pending request. Please wait for admin review."
                });
            }
            if (existing.status === "APPROVED") {
                return res.status(400).json({
                    success: false,
                    message: "Your request has already been approved"
                });
            }
            // If REJECTED — allow re-submission by updating the record
            const updated = await prisma.authorRequest.update({
                where: { userId: req.user.id },
                data: { status: "PENDING" }
            });
            return res.status(200).json({
                success: true,
                message: "Request re-submitted successfully",
                request: updated
            });
        }

        const request = await prisma.authorRequest.create({
            data: {
                userId: req.user.id,
                status: "PENDING"
            }
        });

        res.status(201).json({
            success: true,
            message: "Author request submitted successfully",
            request
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Get My Request Status ─────────────────────────────────────────────────────

export const getMyRequest = async (req, res) => {
    try {
        const request = await prisma.authorRequest.findUnique({
            where: { userId: req.user.id }
        });

        res.json({ success: true, request });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Admin: Get All Requests ──────────────────────────────────────────────────

export const getRequests = async (req, res) => {
    try {
        const requests = await prisma.authorRequest.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true, role: true, createdAt: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Admin: Approve Request ────────────────────────────────────────────────────

export const approveRequest = async (req, res) => {
    try {
        const request = await prisma.authorRequest.findUnique({
            where: { id: req.params.id }
        });

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        if (request.status === "APPROVED") {
            return res.status(400).json({
                success: false,
                message: "Request is already approved"
            });
        }

        // Use a transaction — both updates must succeed or neither does
        await prisma.$transaction([
            prisma.user.update({
                where: { id: request.userId },
                data: { role: "AUTHOR" }
            }),
            prisma.authorRequest.update({
                where: { id: req.params.id },
                data: { status: "APPROVED" }
            })
        ]);

        res.status(200).json({
            success: true,
            message: "Request approved. User is now an author."
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Admin: Reject Request ─────────────────────────────────────────────────────

export const rejectRequest = async (req, res) => {
    try {
        const request = await prisma.authorRequest.findUnique({
            where: { id: req.params.id }
        });

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        if (request.status === "REJECTED") {
            return res.status(400).json({
                success: false,
                message: "Request is already rejected"
            });
        }

        await prisma.authorRequest.update({
            where: { id: req.params.id },
            data: { status: "REJECTED" }
        });

        res.status(200).json({
            success: true,
            message: "Request rejected."
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
