import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
import { loginUser, logoutUser,getComplaints } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
dotenv.config()

router.post('/login',loginUser );
router.get('/logout',logoutUser);
router.get('/getComplaints',auth,getComplaints);


export default router;