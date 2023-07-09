import mongoose, { Schema, Document, Mongoose } from "mongoose"

export enum InviteStatus {
  Pending,
  Accepted,
  Rejected
}

export interface IInvite extends Document {
  _id: string;
  email: string;
  status: InviteStatus;
  createdOn: number | string;
  lastUpdated: number | string;
  from: mongoose.Types.ObjectId;
  tribe: mongoose.Types.ObjectId;
  to?: mongoose.Types.ObjectId[];
}

const InviteSchema = new Schema<IInvite>({
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  email: String,
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tribe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tribe',
    required: true
  },
  status: {
    type: Number,
    default: InviteStatus.Pending
  },
  createdOn: {
    type: String,
    default: new Date().toISOString()
  },
  lastUpdated: String,
})

InviteSchema.pre('save', function(next) {
  var invite = this as IInvite

  invite.lastUpdated = new Date().toISOString()
  next()
})

const Invite = mongoose.model<IInvite>('Invite', InviteSchema)

export default Invite
