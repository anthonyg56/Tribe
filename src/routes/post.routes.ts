import express from 'express'
import mongoose from 'mongoose'
import fs from 'fs'
import { Validator } from 'express-json-validator-middleware'

import upload from '../utils/multer'
import cloudinary from '../utils/cloudinary'

import PostModel from '../models/posts'
import TribeModel, { MemberStatus } from '../models/tribe'

const PostRouter = express.Router()

PostRouter.post('/post', upload().single('image'), async (req, res) => {
  const { body, user, file } = req

  console.log("hi")
  /* Search for Tribe */
  return TribeModel.findById(body._tribeId).exec(async (err, tribe) => {
    if (err) {
      console.log(err)

      return res.status(404).json({
        message: "there was an error searching for the tribe",
      })

    } else if (!tribe) {
      return res.status(404).json({
        message: "No tribe was found"
      })
    }

    // const memberIndex = tribe.members.findIndex(({ _id }) => _id === user?._id)

    // if (!memberIndex) {
    //   return res.json({
    //     message: 'User is not member of the tribe'
    //   })
    // }

    // const member = tribe.members[memberIndex]

    // const roleIndex = tribe.roles.findIndex(({ _id }) => _id === member.role)

    // if (!roleIndex && member.status !== MemberStatus.Owner) {
    //   return res.json({
    //     message: 'User does not have permission, please select a role'
    //   })
    // }

    // const role = tribe.roles[roleIndex]

    // console.log(member.status)
    // if (member.status !== MemberStatus.Owner) {
    //   if (!role.permissions.posts.createPosts) {
    //     return res.json({
    //       message: 'User does not have permission to create a post'
    //     })
    //   }
    // }

    const createdOnTimeStamp = new Date().toISOString()

    console.log(file)
    /* Check to see if there were any images sent to the server, if so then upload to cloudinary */
    if (file) {

      const results = await cloudinary.uploader.upload(file.path).then(response => {
        // /* Remove the file from the folder */
        fs.unlink(file.path, (err) => {
          if (err) console.log(err)
        })
        console.log("made it to success")
        return response
      })
      .catch(err => {
        console.log("made it to error")
        console.log(err)
      })

      if (results) {
        const newPost = new PostModel({
          _tribeId: tribe._id,
          _userId: user?._id,
          content: body.content,
          image: {
            url: results.secure_url,
            pubicId: results.public_id,
          },
          createdOn: createdOnTimeStamp,
        })

        return await newPost.save().then(data => {
          /* in here, send notification to client a post has been made */
          return res.json({
            post: data
          })
        })
        .catch(err => res.status(404).json({ message: 'there was an error', error: err }))
      }
    }

    const newPost = new PostModel({
      _tribeId: tribe._id,
      _userId: user?._id,
      content: body.content,
      createdOn: createdOnTimeStamp
    })

    return await newPost.save().then(data => {
      /* in here, send notification to client a post has been made */

      return res.json({
        post: data
      })
    })
    .catch(err => res.status(404).json({ message: 'there was an error', error: err }))
  })
})

PostRouter.get('/posts/:tribeId', async (req, res) => {
  const { tribeId } = req.params

  const objectId = new mongoose.Types.ObjectId(tribeId)

  return PostModel
  .find({ '_tribeId': objectId })
  .sort('-createdOn')
  .populate('_userId', ['_id', 'avatar', 'name'])
  .exec((err, posts) => {
    if (err) {
       console.log(err)
      return res.json({
        message: "there was an error searching for the post",
        error: err,
        posts: []
      })
    } else if (!posts) {
      return res.json({
        message: "No posts were found",
        error: true,
        post: []
      })
    }

    return res.json({
      error: false,
      message: 'Posts successfully found',
      posts
    })
  })
})

/* Update Likes */
PostRouter.put('/:postId/like', async (req, res) => {
  const { postId } = req.params
  const { userId } = req.body

  PostModel.findById(postId).exec(async (err, post) => {
    if (err) {
      console.log(err)
      return res.json({
        ok: false,
        message: "there was an error searching for the post",
        error: err
      })
    } else if (!post) {
      return res.json({
        ok: false,
        message: "No post was found"
      })
    }

    const index = post.likes.findIndex(data => data.userId == userId)

    if (index === -1) {
      post.likes.push({
        userId: userId
      })
    } else {
      post.likes.splice(index, 1)
    }

    return await post
    .save()
    .then(data => res.json({
      ok: true,
      message: 'Post successfully updated',
      post: data
    })).catch(err => res.json({
      ok: false,
      message: 'There was an error saving the post',
    }))
  })
})

/* Remove a post */
PostRouter.delete('/:postId', async (req, res) => {
  const { postId } = req.params

  try {
    const deleteRes = await PostModel.deleteOne({ _id: postId })

    /* Is this redundant...? */
    const wasDeleted = deleteRes.deletedCount === 1 ? true : false

    if (wasDeleted) {
      return res.json({
        message: 'Post successfully deleted',
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

export default PostRouter
