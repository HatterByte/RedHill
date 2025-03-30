import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
import { createUser, getUser} from '../controllers/authController.js';
import auth from '../middleware/auth.js';
dotenv.config()

router.post('/createUser',createUser);
router.get('/getUser',auth,getUser);

export default router;