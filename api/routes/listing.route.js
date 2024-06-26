import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createListing } from '../controller/listing.controller.js';

const router = express();

router.post('/create-listing', verifyToken, createListing);

export default router;