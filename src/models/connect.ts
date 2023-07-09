/**
 * Schema to keep track of connected users key info
 */
import mongoose, { Schema, Document } from "mongoose"

export interface IConnect extends Document {
  _id: string;
  socketId: string;
  userId: mongoose.Types.ObjectId;
}

const ConnectSchema = new Schema({
  socketId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const Connect = mongoose.model<IConnect>('Connect', ConnectSchema)

export default Connect
