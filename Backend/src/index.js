import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.route.js"
import messageroutes from "./routes/message.route.js"
import cookieParser from "cookie-parser"
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true               
   }));
   
const PORT = process.env.PORT
app.use("/api/v1/auth",authroutes);
app.use("/api/v1/message",messageroutes);

app.listen(PORT,()=>{
     console.log(`Server is running on PORT ${PORT}`);
})