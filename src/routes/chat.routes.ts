// import express from 'express';
// import mongoose from 'mongoose';
// import ChatRoom from '../models/chatRoom';

// const ChatRouter = express.Router()

// /* Get all previews of chats for a user within a specific tribe */
// ChatRouter.get('/previews/', async (req, res) => {
//   const tribeId = req.query.tribeId as unknown
//   const user = req.user

//   if (!user?._id) return res.json({
//     message: 'There was an error, please try again',
//     ok: false
//   });

//   // const matchStage = {
//   //   $match: {
//   //     tribeId: tribeId as string,
//   //     user: {
//   //       $in: [user?._id]
//   //     }
//   //   }
//   // };
//   // const lookupState = {
//   //   $lookup: {
//   //     from: 'users',
//   //     localField: 'users',
//   //     foreignField: ''
//   //   }
//   // }
//   try {
//     const tribeObjectId = new mongoose.Types.ObjectId(tribeId as string)
//     const userObjectId = new mongoose.Types.ObjectId(user._id as string)

//     // const roomsAgg = await Room.aggregate([
//     //   matchStage
//     // ])
//     ChatRoom
//       .find({ tribeId: tribeObjectId, users: userObjectId })
//       .populate({
//         path: 'users',
//         select: ['_id', 'avatar', 'name'],
//       })
//       .populate({
//         path: 'messages',
//         sort: '-timeSent',
//         perDocumentLimit: 15,
//       })
//       .exec((err, data) => {
//         console.log(data)
//         if (err) {
//           console.log(err);
//           return res.json({
//             message: 'There was an error, please try again',
//             ok: false
//           });
//         }

//         return res.json({
//           data,
//           message: 'Everythings ok',
//           ok: true
//         })
//       })
//   } catch (err) {

//   }
// })

// /* Get a room and all its chats */
// ChatRouter.get('/room/', async (req, res) => {
//   const roomId = req.query.roomId as unknown

//   try {
//     const chatRoom = await ChatRoom
//       .findById(roomId)
//       .populate({
//         path: 'users',
//         select: ['_id', 'avatar', 'name'],
//       })
//       .populate({
//         path: 'messages',
//         sort: '-timeSent',
//         perDocumentLimit: 15,
//       })

//     if (!chatRoom) return res.json({
//       message: 'No chat room available',
//       ok: false
//     })

//     return res.json({
//       message: 'Found chat room',
//       ok: true,
//       room: chatRoom
//     })

//   } catch (err) {
//     console.log(err)
//     return res.json({
//       message: 'An error occured, please try again',
//       ok: false
//     })
//   }
// })

// export default ChatRouter
