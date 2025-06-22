import express from "express";
const router = express.Router();
import { register } from "../controllers/auth.controller.js";

router.post("/register",register)
router.post("/login",async (req,res)=>{
    
})

router.get("/logout",async (req,res)=>{
    res.json({msg : 'logout route'})
})

export default router;