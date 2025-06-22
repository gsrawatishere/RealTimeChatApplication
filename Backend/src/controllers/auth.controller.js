import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

