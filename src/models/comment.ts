import mongoose, { Schema, Document } from "mongoose"

interface IComment extends Document {
  _id: string;
  content: string;
  createdOn: string;
  lastUpdated: string;
  _userId: mongoose.Types.ObjectId;
  _postId: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
}

const CommentSchema = new Schema<IComment>({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  _postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdOn: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
  lastUpdated: String,
  likes: [{
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User'
  }]
})

CommentSchema.pre('save', function(next) {
  var comment = this as IComment

  comment.lastUpdated = new Date().toISOString()
  next()
})

const Post = mongoose.model<IComment>('Comment', CommentSchema)

export default Post
