import express from 'express';
import { getDashboardState,getMonthlyStats } from '../controller/dashboard.js';
const router = express.Router();

router.get('/state', getDashboardState);
router.get('/monthly-state', getMonthlyStats)

export default router;