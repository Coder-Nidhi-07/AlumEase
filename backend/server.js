import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/connectDb.js';
import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';
import galleryRouter from './routes/galleryRoute.js';

const app = express();
const port = process.env.PORT || 8000;

// Connect database
connectDB();

// ⭐ Enable CORS
app.use(
  cors({
    origin: [ "https://alumease.onrender.com"],
    credentials: true,
  })
);

// ⭐ FIX: Increase JSON body size limit for Base64 uploads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// API routes
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/gallery', galleryRouter);

app.get("/", (req, res) => {
  res.send("Backend is working");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
