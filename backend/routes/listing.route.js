import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { createListing } from '../controller/listing.controller.js';
import { getUserListings,updateListing,deleteListing,getRecentListings,getListingById} from '../controller/listing.controller.js';

const router = express.Router();

router.post('/create-listing',verifyToken, createListing);
router.get('/user-listings',verifyToken, getUserListings);
router.put("/update-listing/:id", verifyToken, updateListing);
router.delete("/delete-listing/:id", verifyToken, deleteListing);
router.get("/listings/recent",verifyToken, getRecentListings);
router.get("/listings/:id", getListingById);

export default router;