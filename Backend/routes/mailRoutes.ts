import express from "express";
import Mail from "../models/mailModel.ts";
import { sendEmail, getEmail, findSentEmail, markAsRead, deleteEmail } from "../controllers/messageController.ts"

const router = express.Router();

router.post("/send", sendEmail)
router.get("/inbox/:email", getEmail)
router.get("/sent/:email", findSentEmail)
router.patch("/read/:id", markAsRead)
router.delete("/delete/:id", deleteEmail);


export default router;
  