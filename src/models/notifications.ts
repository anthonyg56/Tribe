import mongoose, { Schema, Document } from "mongoose"

export enum NotificationAction {
  AcceptedInvite = "Accepted Invite",
}

interface INotification extends Document {
  _id: string;
  action: NotificationAction;
  sender: mongoose.Types.ObjectId; // User that triggered the notification
  reciever: mongoose.Types.ObjectId; // The tribe that the notification is going to
  message: string;
  read_by: [{
    userId: mongoose.Types.ObjectId;
    dateRead: string;
  }];
  createdOn: string;
}

const NotificationSchema = new Schema<INotification>({
  action: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tribe',
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
  read_by: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dateRead: {
      type: String,
      default: new Date().toISOString()
    }
  }],
  createdOn: {
    type: String,
    default: new Date().toISOString()
  }
})

const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema)

export default NotificationModel
