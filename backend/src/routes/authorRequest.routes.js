import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { createRequest, getMyRequest } from '../controllers/authorRequest.controller.js';

const router = express.Router();

router.post('/', authMiddleware, createRequest);
router.get('/my-request', authMiddleware, getMyRequest);

export default router;
