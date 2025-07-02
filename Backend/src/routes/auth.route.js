import express from "express";
const router = express.Router();
import { login, register, logout, updateProfile, getUserData} from "../controllers/auth.controller.js";
import { updateAccessToken } from "../lib/utils.js";
import { verifyUser } from "../middleware/verify.js";

router.post("/register",register);
router.post("/login",login);
router.post("/refresh-token",updateAccessToken);
router.get("/logout",logout);
router.put("/update-profile",verifyUser,updateProfile);
router.get("/getUser",verifyUser,getUserData);

export default router; 