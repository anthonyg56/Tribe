import { TAvatar } from './utils';

export interface ITribe {
  _id: string;
  avatar: TAvatar;
  name: string;
  description: string;
  createdOn: number;
  rules?: [{
    text: string;
  }];
  roles: ITribeRole[];
  members: TTribeMember[];
}

export interface ITribeRole {
  _id?: string;
  name: string;
  color: string;
  createdBy: string;
  createdOn: string;
  defaultRole: boolean;
  status: MemberStatus;
  permissions: ITribePermissions;
}

export interface ITribePermissions {
  general: {
    editRules: boolean;
    editTribe: boolean;
  };
  membership: {
    createInvite: boolean;
    removeMembers: boolean;
    createRoles: boolean;
    editRolesAndPermissions: boolean;
  };
  posts: {
    createPosts: boolean;
    commentOnPosts: boolean;
    createATimeline: boolean;
    removePosts: boolean;
  };
  chats: {
    sendChats: boolean;
  };
};

export type TTribeMember = {
  _id: {
    _id: string;
    name: string;
    avatar: {
        url: string;
        publicId: string;
    };
  };
  status: MemberStatus;
  role?: string;
  aggreedToRules: boolean;
  memberSince: string;
}

export type TribeMeta = {
  _id: string;
  name: string;
  avatar: TAvatar;
};

export enum MemberStatus {
  Owner,
  Admin,
  Member,
}

export enum RoleFunctions {
  Admin = 'Admin',
  ReadWrite = 'Read Write',
  Read = 'Read',
}
