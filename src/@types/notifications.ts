import { TAvatar } from "./utils";

export enum NotificationAction {
  AcceptedInvite = "Accepted Invite",
}

export interface INotification {
  _id: string;
  action: NotificationAction;
  sender: { // User that triggered the notification
    _id: string;
    name: string;
    avatar: TAvatar;
  };
  reciever: string; // The tribe that the notification is going to
  message: string;
  read_by: [{
    userId: string;
    dateRead: string;
  }];
  createdOn: string;
}
