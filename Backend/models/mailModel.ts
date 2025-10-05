import mongoose, { Schema, Document } from "mongoose";

export interface IMail extends Document {
  sender: string;
  receiver: string;
  subject: string;
  body: string;
  timestamp: Date;
}

const mailSchema = new Schema<IMail>({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IMail>("Mail", mailSchema);
