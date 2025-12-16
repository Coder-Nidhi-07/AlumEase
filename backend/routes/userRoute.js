import express from 'express';
import { 
  getAllUsers, 
  loginUser, 
  registerUser,
  addFeedback,
  getAllFeedback,
  searchAlumni,
  updateProfile,
  getUserProfile
} from '../controller/userController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

// Register
userRouter.post('/register', registerUser);

// Login
userRouter.post('/login', loginUser);
userRouter.get('/profile',authMiddleware,getUserProfile)

// Get all users (directory)
userRouter.get('/all', getAllUsers);

// Submit feedback (only logged-in user)
userRouter.post('/feedback', authMiddleware, addFeedback);

// Get all feedback (public/admin)
userRouter.get('/feedback/all', getAllFeedback);

// get alumini 
userRouter.get('/alumni',authMiddleware,searchAlumni)

// Update user profile
userRouter.put('/profile', authMiddleware, updateProfile);

export default userRouter;
