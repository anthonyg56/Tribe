import mongoose, { Schema, Document } from "mongoose"

export interface IChat extends Document {
  _id?: string;
  read: boolean;
  timeSent: string;
  content: string;
  user: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
}

const ChatSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  timeSent: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
  content: {
    type: String,
    required: true
  }
});

const Chat = mongoose.model<IChat>('Chat', ChatSchema)

export default Chat
