import expess from "express";

import { register, login, getMe } from "../controllers/auth.controller.js";

const router = expess.Router();


router.post ('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

export default router;