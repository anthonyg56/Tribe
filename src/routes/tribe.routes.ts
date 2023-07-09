import express from 'express'
import fs from 'fs'
import { Validator } from 'express-json-validator-middleware'
import Tribe, {  ITribe, ITribeRole, MemberStatus } from '../models/tribe'
import User from '../models/user'
import cloudinary from '../utils/cloudinary'
import upload from '../utils/multer'
import TribeModel from '../models/tribe'
import mongoose from 'mongoose'

const TribeRouter = express.Router()

/* Server route for creating a new Tribe */
TribeRouter.post('/new', upload().single('avatar'), async (req, res) => {
  const { body, file, user } = req

  console.log(body)
  
  let newTribe: ITribe

  if (file) {
    const results = await cloudinary.uploader.upload(file.path)

    /* Remove the file from the folder */
    fs.unlink(file.path, (err) => {
      if (err) console.log(err)
    })

    newTribe = new Tribe({
      name: body.name,
      description: body.description,
      avatar: {
        url: results.url,
        id: results.public_id,
      },
    })
  } else {
    newTribe = new Tribe({
      name: body.name,
      description: body.description,
    })
  }

  /* Default roles that comes with a tribe */
  const adminRole: ITribeRole = {
    name: 'admin',
    color: '#000000',
    defaultRole: false,
    status: MemberStatus.Admin,
    permissions: {
      general: {
        editRules: true,
        editTribe: true,
      },
      membership: {
        createRoles: true,
        createInvite: true,
        removeMembers: true,
        editRolesAndPermissions: true,
      },
      posts: {
        commentOnPosts: true,
        createATimeline: true,
        createPosts: true,
        removePosts: true,
      },
      chats: {
        sendChats: true,
      }
    }
  }

  const memberRole: ITribeRole = {
    name: 'Member',
    color: '#000000',
    defaultRole: true,
    status: MemberStatus.Member,
    permissions: {
      general: {
        editRules: false,
        editTribe: false,
      },
      membership: {
        createRoles: false,
        createInvite: true,
        removeMembers: false,
        editRolesAndPermissions: false,
      },
      posts: {
        commentOnPosts: true,
        createATimeline: false,
        createPosts: true,
        removePosts: false,
      },
      chats: {
        sendChats: true,
      }
    }
  }

  newTribe.roles.push(adminRole)
  newTribe.roles.push(memberRole)

  console.log(user)
  User.findById(body._userId).exec(async (err, user ) => {
    if(err) {
      console.log(err)
      return res.json({ message: 'There was an error finding the user', error: err })
    }

    if(!user) return res.status(400).json({ error: "No user found" })

    user.tribes.push(newTribe.id)

    newTribe.members.push({
      _id: body._userId,
      status: MemberStatus.Owner,
      aggreedToRules: false,
      memberSince: new Date().toISOString(),
    })

    await newTribe.save()
    .then(tribe => tribe)
    .catch(err => {
      console.log(err)
      return res.json({ message: 'There was an error saving the tribe', error: err })
    })

    const newTribeMetaData = {
      _id: newTribe._id,
      name: newTribe.name,
      avatar: newTribe.avatar,
    }

    return await user
    .save()
    .then(user => {
      return res.json({ message: 'tribe uploaded and added to user document', newTribe: newTribeMetaData })
    })
    .catch(err => res.json({ message: 'There was an error saving the tribe to user', error: err }))
  })
})

TribeRouter.get('/:id', async (req, res) => {
  const { params, user } = req

  return Tribe
  .findById(params.id)
  .populate('members._id', ['_id', 'name', 'avatar'])
  .exec((err, tribe) => {

    if (err) {
      console.log(err)
      return res.status(400).json({ error: "There was an error looking for the tribe" })
    }

    if (!tribe) {
      return res.status(400).json({ error: "No tribe found" })
    }

    return res.status(200).json({ message: "Found tribe", tribe, userId: user?._id })
  })
})

/* Update rule for a tribe */
TribeRouter.put('/rules', async (req, res) => {
  const { user } = req
  const { tribeId, rules }: { tribeId: string; rules: [{
    text: string;
  }]} = req.body

  try {
    const tribe = await Tribe.findById(tribeId)

    if(!tribe) {
      return res.json({
        message: 'Tribe does not exist',
        ok: false
      })
    }


    // const memberIndex = tribe.members.findIndex(({ _id }) => _id == user?._id)
    // const member = tribe.members[memberIndex]

    // const roleIndex = tribe.roles.findIndex(({ _id }) => _id === member.role)
    // const role = tribe.roles[roleIndex]

    // if (role.permissions.general.editRules !== true && member.status !== MemberStatus.Owner) {
    //   return res.json({
    //     message: 'User does not have permission to change the rules',
    //     ok: false
    //   })
    // }

    console.log(rules)
    tribe.rules = rules

    await tribe.save()

    return res.json({
      rules: tribe.rules,
      message: 'rules successfully updated',
      ok: true
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'There was an error, please try again',
      ok: false
    })
  }
})

/* Member agrees to rules of a tribe */
TribeRouter.put('/agree', async (req, res) => {
  const { body, user } = req

  if (!user?._id) return res.json({
    message: 'There was an error, please try again',
    ok: false
  })

  try {
    const tribe = await Tribe.findById(body.tribeId)

    if (!tribe) {
      return res.json({
        message: 'No tribe was found, please try again',
        ok: false
      })
    }

    const userObjectId = new mongoose.Types.ObjectId(user._id)
    const userIndex = tribe.members.findIndex(({ _id }) => _id === userObjectId)

    if (!userIndex) {
      return res.json({
        message: `user is not apart of ${tribe.name}`,
        ok: false
      })
    } else if (tribe.members[userIndex].aggreedToRules === true) {
      return res.json({
        message: `user has already agreed to the rules of ${tribe.name}`,
        ok: false
      })
    }

    tribe.members[userIndex].aggreedToRules === true
    await tribe.save()

    return res.json({
      message: `user has aggreed to the rules of ${tribe.name}`,
      ok: true
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'There was an error, please try again.',
      ok: false
    })
  }
})

// /* Create a new role within a tribe */
// TribeRouter.post('/role', async (req, res) => {
//   const { user, body } = req
//   const { tribeId, newRole }: { tribeId: string; newRole: ITribeRole } = body

//   try {
//     const tribe = await Tribe.findById(tribeId)

//     if (!tribe) {
//       return res.json({
//         message: 'No tribe was found, please try again',
//         ok: false
//       })
//     }

//     /* Make sure who ever is creating a role has the permission to do so */
//     const memberIndex = tribe.members.findIndex(({ _id }) => _id == user?._id)
//     const member = tribe.members[memberIndex]

//     const roleIndex = tribe.roles.findIndex(({ _id }) => _id === member.role)
//     const role = tribe.roles[roleIndex]

//     if (!role.permissions.membership.createRoles && member.status !== MemberStatus.Owner) {
//       return res.json({
//         message: 'User does not have permissions to create roles',
//         ok: false
//       })
//     }

//     tribe.roles.push(newRole)

//     await tribe.save()

//     return res.json({
//       message: "Role was successfully pushed",
//       ok: true
//     })
//   } catch (e) {
//     console.log(e)
//     return res.json({
//       message: 'There was an error, please try again',
//       ok: false
//     })
//   }
// })

/* Edit roles & Permissions */
TribeRouter.put('/role', async (req, res) => {
  const { user, body } = req

  if (!user?._id) return res.json({
    message: 'There was an error, please try again',
    ok: false
  })

  const { tribeId, newRoleProps }: { tribeId: string; newRoleProps: ITribeRole } = body

  try {
    const tribe = await Tribe.findById(tribeId)

    if (!tribe) {
      return res.json({
        message: 'No tribe was found, please try again',
        ok: false
      })
    }

    const userObjectId = new mongoose.Types.ObjectId(user._id)
    /* Make sure who ever is creating a role has the permission to do so */
    const memberIndex = tribe.members.findIndex(({ _id }) => _id == userObjectId)
    const member = tribe.members[memberIndex]

    const userRoleIndex = tribe.roles.findIndex(({ _id }) => _id === member.role)
    const userRole = tribe.roles[userRoleIndex]

    if (!userRole.permissions.membership.editRolesAndPermissions && member.status !== MemberStatus.Owner) {
      return res.json({
        message: 'User does not have permissions to create roles',
        ok: false
      })
    }

    const roleIndex = tribe.roles.findIndex(({ _id }) => String(_id) === String(newRoleProps._id))
    tribe.roles[roleIndex] = newRoleProps

    await tribe.save()

    return res.json({
      message: "Role was successfully pushed",
      ok: true
    })
  } catch (e) {
    console.log(e)
    return res.json({
      message: 'There was an error, please try again',
      ok: false
    })
  }
})

/* Let a user select a role */
// TribeRouter.put('role/user', async (req, res) => {
//   const { body, user } = req.body
//   const { tribeId, roleId } = body

//   try {
//     /* Find all entities were making changes to */
//     const tribe = await Tribe.findById(tribeId)

//     if(!tribe) {
//       return res.status(404).json({ message: "No tribe found" })
//     }

//     /* Check permissions */
//     const memberIndex = tribe.members.findIndex(({ _id }) => _id === user?._id)
//     const member = tribe.members[memberIndex]

//     const roleIndex = tribe.roles.findIndex(({ _id }) => _id === roleId)
//     const role = tribe.roles[roleIndex]

//     if(!role.permissions.membership. && member.status !== MemberStatus.Owner) {
//       return res.json({
//         message: 'User does not have permission to create invites',
//         ok: false
//       })
//     }
//   }
// })

TribeRouter.delete('/member', async (req, res) => {
  const { tribeId, memberId } = req.body

  try {
    const tribe = await TribeModel.findById(tribeId)

    if (!tribe) {
      return res.json({
        message: 'Unable to remove member, no tribe available',
        ok: false
      })
    }

    const memberIndex = tribe.members.findIndex(({ _id }) => String(_id) === String(memberId))

    if (!memberIndex) {
      return res.json({
        message: 'Unable to remove member because they are not a member of the tribe',
        ok: false
      })
    }

    tribe.members.splice(memberIndex, 1)

    await tribe.save()

    return res.json({
      message: 'member removed from the tribe',
      ok: true
    })
  } catch (error) {

  }
})

TribeRouter.put('/status', async (req, res) => {
  const { tribeId, memberId, newStatus } = req.body

  try {
    const tribe = await TribeModel.findById(tribeId)

    if (!tribe) {
      return res.json({
        message: 'Unable to update status, no tribe available',
        ok: false
      })
    }

    const memberIndex = tribe.members.findIndex(({ _id }) => String(_id) === memberId)

    if (!memberIndex) {
      return res.json({
        message: 'Unable to update status, member is not apart of the tribe',
        ok: false
      })
    }

    const member = tribe.members[memberIndex]
    member.status = newStatus

    await tribe.save()

    return res.json({
      message: 'Member status successfully updated',
      ok: true
    })
  } catch (err) {

  }
})

TribeRouter.put('/updateSettings/:tribeId', upload().single('avatar'), async (req, res) => {
  const { body, params: { tribeId }, file } = req

  try {
    if (file) {
      const uplodateResults = await cloudinary.uploader.upload(file.path)

      /* Remove the file from the folder */
      fs.unlink(file.path, (err) => {
        if (err) console.log(err)
      })

      delete body.image

      const newBody = body
      newBody.avatar = {
        url: uplodateResults.secure_url,
        id: uplodateResults.public_id
      }

      const results = await TribeModel.updateOne({ _id: tribeId }, newBody)

      if (results.matchedCount >= 1) {
        return res.json({
          message: "Tribe Settings Updated",
          ok: true
        })
      } else {
        return res.json({
          message: "there was an error updating the tribe settings",
          ok: false
        })
      }
    }

    const results = await TribeModel.updateOne({ _id: tribeId }, body)

    if (results.matchedCount >= 1) {
      return res.json({
        message: "Tribe Settings Updated",
        ok: true
      })
    } else {
      return res.json({
        message: "there was an error updating the tribe settings",
        ok: false
      })
    }
  } catch(e) {
    return res.json({
      message: "There was an error trying to delete the tribe, please try again",
      ok: false
    })
  }
})

TribeRouter.delete('/:tribeId', async (req, res) => {
  const { tribeId } = req.params

  try {
    const deleteRes = await TribeModel.deleteOne({ _id: tribeId })

    /* Remove the tribe from all users tribes */


    /* Is this redundant...? */
    const wasDeleted = deleteRes.deletedCount === 1 ? true : false

    if (!wasDeleted) {
      return res.json({
        message: "Tribe couldn't be deleted",
        ok: false
      })
    } else {
      const tribeObjId = new mongoose.Types.ObjectId(tribeId)

      const users = await User.updateMany({ tribes: tribeObjId }, { $pull: { tribes: tribeObjId }})

      if (users.matchedCount === 0) {
        return res.json({
          message: 'Tribe was delete but no users were found within the tribe',
          ok: true
        })
      }

      return res.json({
        message: 'Tribe successfully deleted',
        ok: true
      })
    }
  } catch (e) {
    return res.json({
      message: "There was an error trying to delete the tribe, please try again",
      ok: false
    })
  }
})

export default TribeRouter
