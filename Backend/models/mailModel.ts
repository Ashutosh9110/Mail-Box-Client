import mongoose, { Schema, Document } from "mongoose";

export interface IAttachment {
  filename: string;
  url: string;
  mimetype: string;
  size: number;
}

export interface IMail extends Document {
  sender: string;
  receiver: string;
  subject: string;
  body: string;
  timestamp: Date;
  read: boolean;
  attachments?: IAttachment[]; // ✅ new field
}

const mailSchema = new Schema<IMail>({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  attachments: [
    {
      filename: { type: String },
      url: { type: String },
      mimetype: { type: String },
      size: { type: Number },
    },
  ],
});

export default mongoose.model<IMail>("Mail", mailSchema);
