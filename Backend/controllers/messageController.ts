import { Request, Response } from "express";
import Mail from "../models/mailModel.ts"


export const sendEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sender, receiver, subject, body } = req.body;
    const mail = new Mail({ sender, receiver, subject, body });
    await mail.save();
    res.status(201).json({ message: "Mail sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending mail" });
  }
}



export const getEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const receiver = req.params.email;
    const mails = await Mail.find({ receiver }).sort({ timestamp: -1 });
    res.json(mails);
  } catch (err) {
    res.status(500).json({ message: "Error fetching inbox" });
  }
}



export const findSentEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const sender = req.params.email;
    const mails = await Mail.find({ sender }).sort({ timestamp: -1 });
    res.json(mails);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sent mails" });
  }
}




export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const mail = await Mail.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!mail) {
      res.status(404).json({ message: "Mail not found" });
      return;
    }
    res.status(200).json({ message: "Mail marked as read", mail });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating mail status" });
  }
};
