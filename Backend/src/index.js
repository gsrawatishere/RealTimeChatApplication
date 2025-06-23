import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser"

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT
app.use("/api/v1/auth",authroutes);

app.listen(PORT,()=>{
     console.log(`Server is running on PORT ${PORT}`);
})