import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const prisma = new PrismaClient();

export const generateAccessToken = (userId,res) =>{
   const accessToken = jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:"15m"
   })
   res.cookie("accessToken",accessToken, {
      maxAge : 15*60*1000,
      httpOnly : true,
      sameSite: "strict",
      
   } )
   return accessToken;
}

export const generateRefreshToken = (userId,res)=>{
    const refreshToken = jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{
      expiresIn:"7d"
    })
   res.cookie("refreshToken",refreshToken, {
      httpOnly : true,
      maxAge : 7*24*60*60*1000,
      sameSite: "strict",
   }) 
   return refreshToken;
}
    

export const updateAccessToken = async (req, res) => {
   try {
     const incomingRefreshToken = req.cookies.refreshToken;
 
     if (!incomingRefreshToken) {
       return res.status(401).json({ msg: "No Refresh Token Found!" });
     }
 
     let data;
     try {
       data = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
     } catch (error) {
       return res.status(403).json({ msg: "Invalid or Expired Refresh Token!" });
     }
 
     const id = data.userId;
 
     const userData = await prisma.user.findUnique({
       where: { id },
       select: { refreshToken: true }, 
     });
 
     if (!userData) {
       return res.status(404).json({ msg: "User not found!" });
     }
 
     if (incomingRefreshToken !== userData.refreshToken) {
       return res.status(403).json({ msg: "Refresh Token mismatch!" });
     }
 
     const newAccessToken = jwt.sign(
       { userId: id },
       process.env.ACCESS_TOKEN_SECRET,
       { expiresIn: "15m" }
     );
 
     res.cookie("accessToken", newAccessToken, {
       maxAge: 15 * 60 * 1000,
       httpOnly: true,
       sameSite: "strict",
     });
 
     return res.status(200).json({ msg: "Access token updated" });
   } catch (error) {
     console.error("Error in updateAccessToken route:", error);
     res.status(500).json({ msg: "Unable to update access token", error });
   }
 };