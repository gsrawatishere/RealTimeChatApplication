import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../lib/utils.js';

const prisma = new PrismaClient();

export const register = async (req,res)=>{
    try{
          const {email, fullName, password} = req.body;
          if(password.length < 6){
            res.status(400).json({msg : "Password must be at least 6 characters" })
          }

          const existUser = await prisma.user.findUnique({
            where : {email}
          })
          if(existUser){
           return res.status(401).json({msg :  "User already exists! Please signin."})
          }
          const hashedPassword = await bcrypt.hash(password,12);
          const newUser = await prisma.user.create({
            data : {
                email,
                fullName,
                password : hashedPassword
            }
          })
          res.status(200).json({msg : "Registered Successfully! Please Login", name : newUser.name})
    }
    catch(error){
       console.log("error in register route",error);
       res.status(500).json({msg : "Error in Signup", error})
    }
}

export const login = async (req,res)=>{
  try{
    const {email,password} = req.body;
    
    const existUser = await prisma.user.findUnique({
      where : {email}
    })
    if(!existUser){
        return res.status(400).json({msg : "User does not Exist!"})
    }
    const isMatch = await bcrypt.compare(password,existUser.password);
    if(!isMatch){
      return res.status(400).json({msg : "Invalid Password!"})
    }
     generateAccessToken(existUser.id,res);
    const  refreshToken =   generateRefreshToken(existUser.id,res);

    const updatedUser = await prisma.user.update({
      where:{id : existUser.id},
      data :  {refreshToken}
    })
    
     res.status(200).json({msg : "Login Success!"})
  }
  catch(error){
    console.log("Error in login route", error);
    res.status(500).json({msg : "Error in Login!",error});
  }
}

