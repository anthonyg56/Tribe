import express, {Request} from 'express'
import { Validator } from 'express-json-validator-middleware'

import Transporter from '../utils/transporter'
import Invite, { IInvite, InviteStatus } from '../models/invites'
import Tribe, { MemberStatus } from '../models/tribe'
import User from '../models/user'
import NotificationModel, { NotificationAction } from '../models/notifications'

const InviteRouter = express.Router()

/* Create Invite for users with an account */
InviteRouter.post('/invite', async (req, res) => {
  const { user, body } = req
  const { toUserId, tribeId } = body

  try {
    /* Check and see if there was an invite sent out to a user from the same tribe */
    const inv = await Invite.findOne({ to: toUserId, tribe: tribeId })

    if (inv) {
      return res.json({
        message: 'User has already been invited to this tribe',
        ok: false
      })
    }
    /* Find all entities were making changes to */
    const toUser = await User.findById(toUserId)
    const tribe = await Tribe.findById(tribeId)

    if (!toUser ) {
      return res.status(404).json({ message: "No user found", ok: false })
    } else if (!tribe) {
      return res.status(404).json({ message: "No tribe found", ok: false })
    }

    /* Check and see if the user is apart of the tribe already before sending out an invite */
    const userIndex = tribe.members.findIndex(({ _id }, index) => String(_id) === String(toUser._id))

    console.log(userIndex)

    if (userIndex !== -1) {
      return res.json({
        message: 'User is already apart of this tribe',
        ok: false
      })
    }
    /* Check permissions */
    // const memberIndex = tribe.members.findIndex(({ _id }) => _id === user?._id)
    // const member = tribe.members[memberIndex]

    // const roleIndex = tribe.roles.findIndex(({ _id }) => _id === member.role)
    // const role = tribe.roles[roleIndex]

    // if(!role.permissions.membership.createInvite && member.status !== MemberStatus.Owner) {
    //   return res.json({
    //     message: 'User does not have permission to create invites',
    //     ok: false
    //   })
    // }

    /* If everything is good, create an invite now */
    const invite = new Invite({
      to: toUser.id,
      email: toUser.email,
      from: user?._id,
      tribe: tribe.id,
    })

    /* Save it before pushing it to the user document */
    await invite.save()

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: toUser.email,
      subject: `You've been invited to join ${tribe.name}`,
      text: `Hello,\n\n Someone has invite you to join their tribe ${tribe.name}. Accept the invite and hop right into things by clicking the link:`
    }

    await Transporter.sendMail(mailOptions)

    /* Push and then save */
    toUser.invites.push(invite.id)

    await toUser.save()

    /* TODO: Emit notification with a web socket */
    return res.json({
      message: `${toUser.name} was invited to ${tribe.name}!`,
      ok: true
    })
  } catch(err) {
    console.log(err)
    return res.status(404).json({
      message: 'There was an error',
      ok: false
    })
  }
})

/* Create invite for users who dont have an account and send it through email */
InviteRouter.post('/email', async (req, res, next) => {
  const { user, body } = req
  const { email, tribeId } = body

  try {
    const tribe = await Tribe.findById(tribeId)

    if (!user) {
      return res.status(404).json({ message: "No user found" })
    } else if (!tribe) {
      return res.status(404).json({ message: "No tribe found" })
    }

    /* Check permissions */
    // const memberIndex = tribe.members.findIndex(({ _id }) => _id === user?._id)
    // const member = tribe.members[memberIndex]

    // const roleIndex = tribe.roles.findIndex(({ _id }) => _id === member.role)
    // const role = tribe.roles[roleIndex]

    // if(!role.permissions.membership.createInvite && member.status !== MemberStatus.Owner) {
    //   return res.json({
    //     message: 'User does not have permission to create invites',
    //     ok: false
    //   })
    // }

    const invite = new Invite({
      email: email,
      from: user?._id,
      tribe: tribe.id,
    })

    await invite.save()

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: `You've been invited to join ${tribe.name}`,
      text: `Hello,\n\n Someone has invite you to join their tribe ${tribe.name}. Accept the invite and hop right into things by clicking the link:`
    }

    await Transporter.sendMail(mailOptions)

    return res.json({
      message: `${email} was invited to ${tribe.name}!`
    })
  } catch(err) {
    console.log(err)
    /* Oh noooo */
    return res.json({
      message: 'There was an error, please try again'
    })
  }
})

/* Accept Invite */
InviteRouter.put('/accept', async (req, res, next) => {
  const { inviteId } = req.body

  try {
    /* Find the invite to grab the data we need */
    const invite = await Invite.findById(inviteId) as IInvite

    if (!invite) {
      return res.json({
        message: 'No invite was found',
        ok: false,
        userId: null
      })
    }

    /* Grab the user and tribe document to make the changes we need */
    const user = await User.findById(invite.to)
    const tribe = await Tribe.findById(invite.tribe)

    if (!user) {
      return res.json({
        message: 'No user was found',
        ok: false,
        userId: null
      })
    } else if(!tribe) {
      return res.json({
        message: 'No tribe was found',
        ok: false,
        userId: null
      })
    }

    /* Accept the invite */
    invite.status = InviteStatus.Accepted

    /* Find the index of the invite in the user document and remove it */
    const inviteIndex = user.invites.indexOf(invite.id)

    if (inviteIndex > -1) {
      user.invites.splice(inviteIndex)
    }

    /* Find the default role of a tribe */
    // const defaultRoleIndex = tribe.roles.findIndex(({ defaultRole }) => defaultRole === true)
    // const defaultRole = tribe.roles[defaultRoleIndex]

    /* Add the tribe to the user document and the user to the tribe document */
    user.tribes.push(tribe.id)
    tribe.members.push({
      _id: user.id,
      status: MemberStatus.Member,
      aggreedToRules: false,
      memberSince: new Date().toISOString(),
      //role: defaultRole._id,
    })


    /* Save all changes made */
    await user.save()
    await tribe.save()
    await invite.save()

    /* Push out a notification to the Tribe */
    const newNotification = new NotificationModel({
      action: NotificationAction.AcceptedInvite,
      sender: user._id,
      reciever: tribe._id,
      message: `${user.name} has joined the Tribe!`
    })

    // newNotification.save().then(data => {
    //   const io = req.app.get('socketio')

    //   /* emit the notification to those connect to the client */
    //   io.of('tribe').in(tribe.id).emit('new notification', data)
    // })

    /* Notify client everything is alllll gooood */
    return res.json({
      message: `${user.name} is now apart of ${tribe.name}!`,
      ok: true,
      userId: user._id
    })
  } catch(err) {
    console.log(err)
    /* Oh noooo */
    return res.json({
      message: 'There was an error, please try again',
      ok: false,
      userId: null
    })
  }
})

/* Reject Invite */
InviteRouter.put('/reject', async (req, res, next) => {
  const { inviteId } = req.body

  try {
    const invite = await Invite.findById(inviteId)

    if (!invite) {
      return res.json({
        message: "No invite was found",
        ok: false,
        userId: null
      })
    }

    const user = await User.findById(invite.to)

    if (!user) {
      return res.json({
        message: "No user was found",
        ok: false,
        userId: null
      })
    }

    invite.status = InviteStatus.Rejected

    const inviteIndex = user.invites.indexOf(invite.id)
    if(inviteIndex > -1) {
      user.invites.splice(inviteIndex)
    }

    await user.save()
    await invite.save()

    return res.json({
      message: 'Invite rejected and removed',
      ok: true,
      userId: user._id
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'There was an error, please try again',
      ok: false,
      userId: null
    })
  }
})

/* Generate an invite link (?) */
InviteRouter.post('/generate', async (req, res, next) => {
  const { tribeId, userId } = req.body

  try {
    const user = await User.findById(userId)
    const tribe = await Tribe.findById(tribeId)

    if (!user) {
      return res.status(404).json({ message: "No user found" })
    } else if (!tribe) {
      return res.status(404).json({ message: "No tribe found" })
    }

    const invite = new Invite({
      from: {
        user: user.id,
        tribe: tribe.id,
      }
    })

    await invite.save()

    return res.json({
      message: `Invite to ${tribe.name} was created`,
      id: invite.id
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'There was an error, please try again'
    })
  }
})

/* Validate Invite (?) */
InviteRouter.put('/validate', async (req, res, next) => {

})

export default InviteRouter
