import express from 'express';
import { fetchPNRDetails } from '../controllers/pnrController.js';

const router = express.Router();

router.get("/:pnr", fetchPNRDetails);

export default router;