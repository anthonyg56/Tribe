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

  try {
    /* Find all the notifications in an array */
    const notifications = await NotificationModel.find({ '_id': { $in: notificationIds }})

    /* IF there are no notifications return */
    if (!notifications.length) {
      return res.json({
        ok: false,
        message: 'No notifications available',
      })
    }

    /* Transverse the array to read all the notifications */
    for (let i = 0; i < notifications.length; i++) {
      const userObjectId = new mongoose.Types.ObjectId(userId)
      /* Check if a user has already read the notification */
      const isRead = notifications[i].read_by.findIndex(user => String(user.userId) === String(userObjectId))

      if (isRead === 0) return

      /* if the user has not read the notification, go ahead and push them into the array */
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

/* Get all of a tribes unread notifications for a user */
NotificationRouter.get('/unread/:tribeId/:userId', async (req, res) => {
  const { tribeId, userId } = req.params

  try {
    const objectId = new mongoose.Types.ObjectId(tribeId)
    const tribeNotifications = await NotificationModel.find({ 'reciever': objectId }).populate('sender', ['name', 'avatar'])

    const unreadNotifications = tribeNotifications.filter(notification => {
      const { read_by } = notification
      const userObjectId = new mongoose.Types.ObjectId(userId)
      const userIndex = read_by.findIndex(({ userId: id }) => String(id) === String(userObjectId))

      if (userIndex !== 0) {
        return notification._id
      }
      return
    })

    console.log(unreadNotifications)
    return res.json({
      ok: true,
      message: 'Notifications found',
      notifications: unreadNotifications
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'There was an error searching for the notifications, please try again',
      ok: false
    })
  }
})

export default NotificationRouter
