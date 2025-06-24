import express from "express";
import { verifyUser } from "../middleware/verify.js";
import { getAllUsers, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users",verifyUser,getAllUsers);
router.get("/:id",verifyUser,getMessages);
router.post("/send/:id",verifyUser,sendMessage)


export default router;