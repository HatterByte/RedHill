import express from 'express';
import { 
    registerComplaint, 
    getComplaintById, 
    getUserComplaints, 
    getAllComplaints 
} from '../controllers/complaintController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register a new complaint (auth optional)
router.post('/register', auth, registerComplaint);

// Get complaint by ID
router.get('/complaint/:complaintId', auth, getComplaintById);

// Get all complaints for a user (requires authentication)
router.get('/user/:userId', auth, getUserComplaints);

// Get all complaints (admin only)
router.get('/', auth, getAllComplaints);

export default router;