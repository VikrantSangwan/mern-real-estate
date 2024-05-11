import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import cookieParser from "cookie-parser";

// enable environment variable access in vite
dotenv.config();

// connecting to the database
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Initating the app using express
const app = express();
// Making all the response received in the json format
app.use(express.json());
// Using cookie Parser to make cookies accessible all over the code
app.use(cookieParser());

// Making different routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter)

// middleware for handling next function
app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.json({
      success: false,
      statusCode,
      message,
    });
})

// Listening app at port 3000
app.listen(3000);
