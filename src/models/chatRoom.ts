import mongoose, { Schema, Document } from "mongoose"

export interface IChatRoom extends Document {
  _id?: string;
  createdAt: string;
  tribeId: mongoose.Types.ObjectId;
  messages: mongoose.Types.ObjectId[];
  users: [mongoose.Types.ObjectId, mongoose.Types.ObjectId];
}

const ChatRoomSchema = new Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  tribeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tribe',
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }],
  createdAt: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  }
})

/* There should always be two users within one chatroom, this function is to check that */
// ChatRoomSchema.obj.users.required = function() {
//   console.log(this.users.length <= 2)
//   return this.users.length <= 2
// }

const ChatRoom = mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema)

export default ChatRoom
