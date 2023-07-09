import mongoose, { Schema, Document } from "mongoose"

export enum MemberStatus {
  Owner,
  Admin,
  Member
}

export interface ITribeRole {
  _id?: string;
  name: string;
  color: string;
  defaultRole: boolean;
  status: MemberStatus;
  permissions: ITribePermissions;
};

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

export interface ITribe extends Document {
  _id: string;
  avatar?: {
    url: string;
    _publicId: string;
  }
  name: string;
  description: string;
  createdOn: string;
  rules?: [{
    text: string;
  }];
  roles: ITribeRole[];
  members: {
    _id: mongoose.Types.ObjectId;
    status: MemberStatus;
    role?: string;
    aggreedToRules: boolean;
    memberSince: string;
  }[];
}

const TribeSchema = new Schema<ITribe>({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    _publicId: {
      type: String
    },
    url: {
      type: String
    },
  },
  description: {
    type: String,
    required: true,
  },
  rules: [{
    text: {
      type: String
    }
  }],
  roles: [{
    name: {
      type: String,
      required: true
    },
    status: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdOn: {
      type: String,
      default: new Date().toISOString()
    },
    defaultRole: {
      type: Boolean,
      require: true,
    },
    permissions: {
      general: {
        editRules: Boolean,
        editTribe: Boolean,
      },
      membership: {
        createInvite: Boolean,
        acceptAndRejectinvite: Boolean,
        removeMembers: Boolean,
        createRoles: Boolean,
        editRolesAndPermissions: Boolean,
      },
      posts: {
        createPosts: Boolean,
        commentOnPosts: Boolean,
        createATimeline: Boolean,
        removePosts: Boolean,
      },
      chats: {
        sendChats: Boolean,
      },
    },
  }],
  members: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: Number,
      default: MemberStatus.Member
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
    },
    aggreedtoRules: {
      type: Boolean,
      default: false
    },
    memberSince: {
      type: String,
      default: new Date().toISOString()
    }
  }],
  createdOn: {
    type: String,
    default: new Date().toISOString()
  }
})

const TribeModel = mongoose.model<ITribe>('Tribe', TribeSchema)

export default TribeModel
