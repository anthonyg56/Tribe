import { TribeMeta } from "./tribes";
import { TAvatar } from "./utils";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  password: string;
  avatar: TAvatar;
  tribes: TribeMeta[];
  invites: IInvite[];
}

export enum InviteStatus {
  Pending,
  Accepted,
  Rejected
}

export interface IInvite extends Document {
  _id: string;
  to?: string;
  from: string;
  email: string;
  tribe: {
    _id: string;
    name: string;
    description: string;
    avatar: TAvatar;
  };
  status: InviteStatus;
  createdOn: number | string;
  lastUpdated: number | string;
}

export interface UserMeta{
  _id: string;
  avatar: TAvatar;
  name: string;
}
