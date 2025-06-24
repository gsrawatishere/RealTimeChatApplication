import express from "express";
import { verifyUser } from "../middleware/verify.js";
import { getAllUsers } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users",verifyUser,getAllUsers);


export default router;