import { PrismaClient } from "@prisma/client";
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