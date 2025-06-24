import { PrismaClient } from "@prisma/client";
import cloudinary from "../lib/cloudinary";
const prisma = new PrismaClient();

export const getAllUsers = async (req,res)=>{
    try {
          const loggedInUserId = req.user.id;
          const filteredUser = await prisma.user.findMany({
            where : {
                id : {
                    not : loggedInUserId
                }
            },
            select : {
                id : true,
                fullName : true,
                email : true,
                profilePic : true
            }
          })
        res.status(200).json({"users" : filteredUser})

    } catch (error) {
        console.log("Error in finding all users!", error);
        res.status(500).json({msg : "Unable to find all users!",error});
    }
}

export const getMessages = async (req,res) => {
    try {
            const {id:userToChatId}  = req.params;
            const myId = req.user.id;

            const messages = await prisma.message.findMany({
               where : {
                OR: [
                    {senderId : myId,receiverId :userToChatId },
                    {senderId : userToChatId, receiverId : myId}
                ]
               },
               orderBy : {
                timestamp : 'asc'  // oldest first
               }
               
            })
        res.status(200).json({messages})

    } catch (error) {
         console.log("Error in getMessages route",error);
         res.status(500).json({msg : "Unable to Load messages!",error});
    }
}

export const sendMessage = async (req,res) => {
    try {
         const {text,image} = req.body;
         const {id: receiverId} = req.params;
         const senderId = req.user.id;

         if (!text && !image) {
            return res.status(400).json({ msg: "Empty Message!" });
         }

         let imageUrl = "";
         if(image){
            const uploadResponse = await cloudinary.uploader.upload(image,{
                folder : "chat_images"
            });
            imageUrl = uploadResponse.secure_url;
         }
         
         const newMessage = await prisma.message.create({
            data : {
                senderId,
                receiverId,
                text : text || "", 
                image : imageUrl || "",
            },
         })
 // logic here -------- socket.io

         res.status(201).json({
            message: newMessage
          });
      
    }
     catch (error) {
         console.log("Error in sendmessage route",error);
         res.status(500).json({msg : "Unable to send message!", error})
    }
}