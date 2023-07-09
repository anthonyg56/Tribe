import express from 'express'
import mongoose from 'mongoose'
import NotificationModel from '../models/notifications'

const NotificationRouter = express.Router()

/* Get all of a tribes notifications based on the TribeId */
NotificationRouter.get('/:tribeId', async (req, res) => {
  const { tribeId } = req.params

  try {
    const objectId = new mongoose.Types.ObjectId(tribeId)
    const tribeNotifications = await NotificationModel.find({ 'reciever': objectId }).populate('sender', ['name', 'avatar'])

    return res.json({
      ok: true,
      message: 'Notifications found',
      notifications: tribeNotifications
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'There was an error searching for the notifications, please try again',
      ok: false
    })
  }
})

/* Read notifications upon viewing it */
NotificationRouter.put('/read', async (req, res) => {
  const { notificationIds, userId } = req.body
  console.log(req.body)
  console.log(userId)
  try {
    const notifications = await NotificationModel.find({ '_id': { $in: notificationIds }})

    if (!notifications) {
      return res.json({
        ok: false,
        message: 'No notifications available',
      })
    }

    for (let i = 0; i < notifications.length; i++) {
      notifications[i].read_by.push({
        userId,
        dateRead: new Date().toISOString()
      })

      await notifications[i].save()
    }

    return res.json({
      ok: true,
      message: 'Notifications Updated',
    })
  } catch (err) {
    console.log(err)
  }
})

export default NotificationRouter
