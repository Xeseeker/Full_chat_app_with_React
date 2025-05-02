import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getUsersForSidebar,getMessages,sendMessage} from "../controllers/message.controller.js"
const router=express.Router();

router.get("/user",protectRoute,getUsersForSidebar)
router.get("/:id",protectRoute,getMessages)// this will get the user message with the specific contact/user
router.post("/send/:id",protectRoute,sendMessage)
export default router;