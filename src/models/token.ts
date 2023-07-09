import mongoose, { Schema, Document, Mongoose } from "mongoose"

export interface IEmailValidationToken extends Document{
  _userId: mongoose.Types.ObjectId;
  token: string;
  createdAt: number;
}

const EmailValidationTokenSchema = new Schema<IEmailValidationToken>({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Number,
    required: true,
    default: Date.now(),
    expires: 43200
  },
})

const EmailValidationToken = mongoose.model<IEmailValidationToken>('EMToken', EmailValidationTokenSchema)

export default EmailValidationToken
