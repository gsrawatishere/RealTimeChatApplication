import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

const prisma = new PrismaClient();

//register
export const register = async (req,res)=>{
    try{
          const {email, fullName, password,publicKey} = req.body;
          if(!email || !fullName || !password){
            res.status(400).json({msg : "All fields are required!" })
          }
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
                password : hashedPassword,
                publicKey

            }

          })
          console.log(newUser)
          res.status(200).json({msg : "Registered Successfully! Please Login", name : newUser.fullName})
    }
    catch(error){
       console.log("error in register route",error);
       res.status(500).json({msg : "Error in Signup", error})
    }
}

//login
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

//logout

export const logout = (req, res) => {
  try {
    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
    });

    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({ msg: "Logged out successfully!" });
  } catch (error) {
    console.log("Error in Logout route!", error);
    res.status(500).json({ msg: "Failed to Logout!", error });
  }
};

//update profile pic

export const updateProfile = async (req,res) => {
  try {
         const {profilePic} = req.body;
         
          if(!profilePic) {
            return res.status(400).json({msg : "Profile pic is required!"})
          }

    const id = req.user.id;

     const updatedUser = await prisma.user.update({
      where : {id},
      data : {profilePic }
     })
  
     res.status(200).json({msg : "Updated user profile!"})

  } catch (error) {
     console.log("Error in update profile", error);
     res.status(500).json({msg : "Error in update profile", error});
  }
}

 export const getUserData = async (req,res)=>{
  try {
          const userData = req.user;
          res.status(200).json({userData})
  } catch (error) {
    console.log("Error in get user data ", error);
    res.status(500).json({msg : "Error in getting user data ", error});
  }
}

