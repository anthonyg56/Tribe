import { TAvatar } from './utils';

/* The difference between this type and the regular IPost is that in the response variant, _userId is populated */
export type IPostResponse = {
  _id: string;
  _tribeId: string;
  _userId: {
    _id: string;
    name: string;
    avatar: TAvatar;
  };
  content: string;
  image?: {
    url: string;
    publicId: string;
  };
  likes?: [{
    _id: string;
    dateLiked: string | number;
  }];
  comments?: [string];
  createdOn: number | string;
  lastUpdated: number | string;
}

export type IPost = {
  _id: string;
  _tribeId: string;
  _userId: string;
  content: string;
  images?: [{
    url: string;
    publicId: string;
  }];
  likes?: [{
    _id: string;
    dateLiked: string | number;
  }];
  comments?: [string];
  createdOn: number | string;
  lastUpdated: number | string;
}

export interface IComment {
  _id: string;
  _postId: string;
  content: string;
  createdOn: string;
  lastUpdated: string;
  _userId: {
    _id: string;
    avatar: TAvatar;
    name: string;
  };
  likes: string[];
}
