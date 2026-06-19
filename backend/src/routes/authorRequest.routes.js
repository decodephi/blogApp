import express from 'express'
console.log("author request route loaded")

import authMiddleware from '../middleware/auth.middleware.js'

import {createRequest} from '../controllers/authorRequest.controller.js'

const router = express.Router()

router.post('/', authMiddleware, createRequest)


export default router;
