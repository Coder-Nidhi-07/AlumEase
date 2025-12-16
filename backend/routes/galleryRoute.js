import express from 'express';
import { addGalleryItem, getGalleryItems } from '../controller/galleryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { protectAdmin } from '../middleware/authAdmin.js';

const galleryRouter = express.Router();

galleryRouter.post('/add', protectAdmin, addGalleryItem);
galleryRouter.get('/all', getGalleryItems);

export default galleryRouter;
