import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const verifyUser = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
  
    if (!accessToken) {
      return res.status(401).json({ msg: 'No Access Token!' });
    }
  
    try {
      const data = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  
      if (!data || !data.userId) {
        return res.status(403).json({ msg: "Unauthorized user!" });
      }
  
      const id = data.userId;
  
      const userData = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePic: true,
          registeredAt : true,
          publicKey : true
        },
      });
  
      if (!userData) {
        return res.status(403).json({ msg: "User not found!" });
      }
  
      req.user = userData;
      next();
    } catch (error) {
      console.error('Token Verification Error:', error);
      return res.status(403).json({ msg: 'Invalid or Expired Access Token!' });
    }
  };