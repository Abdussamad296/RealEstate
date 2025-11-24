import express from 'express';
const router = express.Router();
import { getBestDeals, getPropertiesByCity, searchProperties } from '../controller/homePage.js';

router.get('/search', searchProperties);
router.get('/cities', getPropertiesByCity);
router.get("/best-deals", getBestDeals)

export default router;