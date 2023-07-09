import mongoose, { Schema, Document } from "mongoose"

export interface IPost extends Document {
  _id: string;
  _tribeId: mongoose.Types.ObjectId;
  _userId: mongoose.Types.ObjectId;
  content: string;
  image: {
    url: string;
    publicId: string;
  };
  likes: [{
    userId: mongoose.Types.ObjectId;
    dateLiked?: string | number;
  }];
  comments: [string];
  createdOn: number | string;
  lastUpdated: number | string;
}

const PostSchema = new Schema<IPost>({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  _tribeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tribe',
    required: true
  },
  content: {
    type: String,
  },
  createdOn: {
    type: String,
    required: true,
  },
  lastUpdated: String,
  image: {
    url: {
      type: String,
      require: true,
    },
    publicId: {
      type: String
    },
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dateLiked: {
      type: String,
      default: new Date().toISOString()
    }
  }]
})

PostSchema.pre('save', function(next) {
  var post = this as IPost

  post.lastUpdated = new Date().toISOString()
  next()
})

const Post = mongoose.model<IPost>('Post', PostSchema)

export default Post
