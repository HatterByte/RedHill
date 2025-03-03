import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
import { loginUser, logoutUser } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
dotenv.config()

router.post('/login',loginUser );
router.get('/logout',logoutUser);

export default router;