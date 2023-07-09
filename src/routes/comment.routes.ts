import express from 'express';
import mongoose from "mongoose"
import Post from '../models/posts';
import Comment from '../models/comment';

const CommentRouter = express.Router();

/* Create a comment */
CommentRouter.post('/', async (req, res) => {
  const { body, user } = req;

  try {
    const post = await Post.findById(body.postId);

    if(!post) {
      return res.json({
        message: 'Unable to create comment, post does not exist',
        ok: false
      });
    };

    const newComment = new Comment({
      _userId: user?._id,
      _postId: post._id,
      content: body.content
    });

    await newComment.save()

    post.comments.push(newComment._id)

    await post.save()

    const populatedComment = await Comment
      .findById(newComment._id)
      .populate('_userId', ['avatar', 'name', '_id'])

    return res.json({
      message: 'comment created',
      ok: true,
      newComment: populatedComment
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'There was an error uploading the comment, please try again',
      ok: false
    })
  }
})

/* Get all comments of a post */
CommentRouter.get('/comments/:postId', async (req, res) => {
  const { postId } = req.params

  try {
    const objectId = new mongoose.Types.ObjectId(postId)

    const comments = await Comment
      .find({ '_postId': objectId })
      .sort('-createdOn')
      .populate('_userId', ['avatar', 'name', '_id'])

    return res.json({
      comments,
      message: 'found comments',
      error: false
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'There was an error searching for the comments',
      comments: [],
      error: err
    })
  }
})

/* Remove a comment */
CommentRouter.delete('/:commentId', async (req, res) => {
  const { commentId } = req.params

  try {
    const deleteRes = await Comment.deleteOne({ _id: commentId })

    /* Is this redundant...? */
    const wasDeleted = deleteRes.deletedCount === 1 ? true : false

    if(wasDeleted) {
      return res.json({
        message: 'Comment was successfully deleted',
        ok: true
      })
    } else {
      return res.json({
        message: "Comment couldn't be deleted",
        ok: false
      })
    }
  } catch (e) {
    return res.json({
      message: "There was an error trying to delete the comment, please try again",
      ok: false
    })
  }
})

/* Update Likes */
CommentRouter.put('/:commentId/like', async (req, res) => {
  const { commentId } = req.params
  const { userId } = req.body

  Comment.findById(commentId).exec(async (err, comment) => {
    if (err) {
      console.log(err)
      return res.json({
        ok: false,
        message: "there was an error searching for the comment",
        error: err
      })
    } else if (!comment) {
      return res.json({
        ok: false,
        message: "No comment was found"
      })
    }

    const index = comment.likes.findIndex(data => data == userId)

    if (index === -1) {
      comment.likes.push(userId)
    } else {
      comment.likes.splice(index, 1)
    }

    return await comment
    .save()
    .then(data => res.json({
      ok: true,
      message: 'Post successfully updated',
      comment: data
    })).catch(err => res.json({
      ok: false,
      message: 'There was an error saving the post',
    }))
  })
})

export default CommentRouter
