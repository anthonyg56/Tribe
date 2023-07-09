import express from 'express';
import passport from 'passport';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { Validator } from 'express-json-validator-middleware';

import User from '../models/user'
import upload from '../utils/multer'
import cloudinary from '../utils/cloudinary'

const UserRouter = express.Router()
const { validate } = new Validator({
  allErrors: false
})

/* Find a user within the database through autocomplete */
UserRouter.get('/autocomplete', async (req, res, next) => {
  const { query } = req.query

  console.log(query)
  /**
   * MongoDB $search Aggregation Pipeline stage query.
   *
   * This stage is pretty self explanatory, typically used for searching, but in this case its to help with autocomplete
   *
   * learn more about this stage: https://docs.atlas.mongodb.com/reference/atlas-search/query-syntax/
   * Learn more about the opperators (compound, should, autocomplete): https://docs.atlas.mongodb.com/reference/atlas-search/operators/#std-label-operators-ref
   *
   * NOTE: MUST HAVE AN INDEX CREATED IN THE DB
   */
  const autocompleteStage = {
    $search: {
      index: 'autocomplete',
      compound: {
        should: [
          {
            autocomplete: {
              query: query,
              path:'name'
            }
          },
          {
            autocomplete: {
              query: query,
              path: 'email'
            }
          }
        ]
      }
    }
  }

  /**
   * Mongodb Project Stage
   *
   * In this stage we tell mongodb we only want to return these properties from the user document in the query
   *
   */
  const projectState = {
    $project: {
      id: 1,
      name: 1,
      email: 1,
      tribes: 1,
      avatar: 1,
    }
  }

  await User.aggregate([autocompleteStage, projectState]).then(users => {
    if (!users.length) {
      return res.json({ users: null, error: "No user found", ok: false })
    }

    console.log(users)
    return res.json({
      users
    })
  })
  .catch(err => {
    console.log(err)
    return res.json({
      message: 'There was an error'
    })
  })
})

/* Normal search for a user within the database */
UserRouter.get('/:id', async (req, res, next) => {
  const userId = req.params.id

  User
  .findById(userId)
  .populate('tribes', ['name', 'avatar'])
  .populate({
    path: 'invites',
    populate: {
      path: 'tribe',
      model: 'Tribe',
      select: ['avatar', 'name', 'description']
    }
  }).exec( (err, user) => {

    if (err) {
      return res.status(404).json({
        message: 'There was an error',
      })
    }

    if (!user) {
      return res.status(400).json({ error: "No user was found" })
    }

    return res.status(200).json({ message: "Found a user", user })
  })
})

/* Update a users avatar */
UserRouter.put('/:id/avatar', upload().single('avatar'), async (req, res) => {
  const { params, file } = req

  // Upload file to cloudinary
  const results = await cloudinary.uploader.upload(file.path)

  /* Remove the file from the folder */
  fs.unlink(file.path, (err) => {
    if (err) console.log(err)
  })

  User.findById(params.id).exec(async (err, user) => {

    if (err) {
      console.log(err)
      return res.status(404).json({ error: 'There was an error, please try again'})
    }

    if (!user) {
      return res.status(404).json({ error: "No user found" })
    }

    // Save user avatar
    user.avatar.cloudinary_id = results.public_id
    user.avatar.url = results.url

    return user
    .save()
    .then(user => res.status(200).json({ message: "User avatar updated", avatar: user.avatar }))
    .catch(err => res.json({ message: "There was an error", error: err }))
  })

})

/* Update user password */
UserRouter.put('/:id/password', async (req, res, next) => {
  const { params, body } = req

  // Find user by id
  User.findById(params.id).exec(async(err, user) =>{
    if (err) {
      return res.status(404).json({
        message: 'There was an error', ok: false
      })
    }

    if (!user) {
      return res.status(404).json({ message: "No user found", ok: false })
    }

    // Compare user password
    const isMatch = await bcrypt
    .compare(body.password, user.password)
    .then(isMatch => isMatch)
    .catch(err => next(err))

    // Check if new password is the same as the old one
    const isSamePw = await bcrypt
    .compare(body.newPassword, user.password)
    .then(isMatch => isMatch)
    .catch(err => next(err))

    if (!isMatch) {
      return res.status(404).json({ message: 'Password is incorrect', ok: false })
    } else if(isSamePw) {
      return res.status(404).json({ message: 'Cannot use the same password twice', ok: false })
    }

    user.password = body.newPassword

    return user
    .save()
    .then(user => res.status(200).json({ message: "user password updated", ok: true }))
    .catch(err => next(err))
  })
})

/* Update a users username */
UserRouter.put('/:id/name', async (req, res, next) => {
  const { params, body } = req
  const userId = params.id

  User.findById(userId).exec(async (err, user) => {
    if (err) {
      return res.status(404).json({
        message: 'There was an error, please try again', ok: false
      })
    }

    if (!user) {
      return res.status(404).json({ message: "No user found", ok: false })
    } else if (user.name === body.name) {
      return res.status(404).json({ message: "You cannot use the same username twice", ok: false })
    }

    // Compare user password
    const isMatch = await bcrypt
    .compare(body.password, user.password)
    .then(isMatch => isMatch)
    .catch(err => next(err))

    if (!isMatch) return res.status(404).json({ message: 'Password is incorrect', ok: false })

    user.name = body.name

    return await user
    .save()
    .then(user => res.json({
      msg: "Username successfull updated!",
      ok: true
    }))
    .catch(err => {
      console.log(err.errors.username.message)
      return res.status(404).json('There was an error')
    })
  })
})

/* Update a users email */
UserRouter.put('/:id/email', async (req, res, next) => {
  const { params, body } = req
  const userId = params.id

  User.findById(userId).exec(async (err, user) => {
    if (err) return next(err)

    if (!user) {
      return res.status(400).json({ error: "No user found", ok: false })
    } else if (user.email === body.email) {
      return res.json({ error: "You cannot use the same email twice", ok: false })
    }

    // Compare user password
    const isMatch = await bcrypt
    .compare(body.password, user.password)
    .then(isMatch => isMatch)
    .catch(err => next(err))

    if (!isMatch) return res.json({ error: 'Password is incorrect', ok: false })

    User.findById(userId).exec(async (err, isUser) => {
      if (err) return next(err)

      if( isUser) return res.json({ error: "Email Taken", ok: false })

      user.email = body.email

      return await user
      .save()
      .then(user => {
        // Send Email to confirm new email changes here

        return res.json({
          msg: "Email successfull updated!",
          ok: true
        })
      })
      .catch(err => {

        return next(err)
      })
    })
  })
})

// UserRouter.put('/:id/update', async (req, res, next) => {
//   const { params, body } = req

//   await User.findById(params.id, (err, user) => {
//     if(err) return next(err)

//     if(!user) {
//       return res.status(400).json({ error: "No user found" })
//     }

//     user.bio = body.bio || user.bio
//     user.birthday = body.birthday || user.birthday

//     user
//     .save()
//     .then(user => res.json({
//       msg: "User successfull updated!",
//       user
//     }))
//     .catch(err => next(err))
//   })
// })



export default UserRouter
