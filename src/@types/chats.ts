import { TAvatar } from "./utils";

export interface IChatRoom {
  _id?: string;
  tribeId: string;
  messages: IChat[];
  createdAt: string;
  users: [{
    _id: string;
    name: string;
    avatar: TAvatar;
  }, {
    _id: string;
    name: string;
    avatar: TAvatar;
  }];
}

export interface IChat {
  _id?: string;
  user: {
    _id: string;
    name: string;
    avatar: TAvatar;
  };
  room: string;
  read: boolean;
  timeSent: string;
  content: string;
}

export interface IChatPreviewRooms {
  _id?: string | undefined;
  tribeId: string;
  messages: IChat[];
  createdAt: string;
  users: [{
    _id: string;
    avatar: TAvatar;
    name: string
  }]
}[];
