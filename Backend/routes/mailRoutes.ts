import express from "express";
import Mail from "../models/mailModel.ts";

const router = express.Router();

// Send a new mail
router.post("/send", async (req, res) => {
  try {
    const { sender, receiver, subject, body } = req.body;
    const mail = new Mail({ sender, receiver, subject, body });
    await mail.save();
    res.status(201).json({ message: "Mail sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending mail" });
  }
});

// Get inbox mails
router.get("/inbox/:email", async (req, res) => {
  try {
    const receiver = req.params.email;
    const mails = await Mail.find({ receiver }).sort({ timestamp: -1 });
    res.json(mails);
  } catch (err) {
    res.status(500).json({ message: "Error fetching inbox" });
  }
});

// Get sent mails
router.get("/sent/:email", async (req, res) => {
  try {
    const sender = req.params.email;
    const mails = await Mail.find({ sender }).sort({ timestamp: -1 });
    res.json(mails);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sent mails" });
  }
});

export default router;
