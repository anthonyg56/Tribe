
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Cookie from 'cookie'
import Jwt from 'jsonwebtoken'

import Chat, { IChat } from '../models/chats'
import ChatRoom, { IChatRoom } from '../models/chatRoom'
import Connect, { IConnect } from '../models/connect'
import { ExtendedError } from "socket.io/dist/namespace";
import User from "../models/user";
import mongoose from "mongoose";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || ''

interface SecureSocket extends Socket {
  userId: string;
}

interface DecodedToken {
  user: {
    _id: string;
    email: string;
  };
  iat: number;
}

export default (io: Server<DefaultEventsMap, DefaultEventsMap>) => {
    /* Create two namespaces for different events happening within a tribe */
    const TribeNamespace = io.of('/tribe')
    const ChatNamespace = io.of('/chat')

    /* Validates a socket connection through cookie authentication */
    const validationMiddleware = async (socket: Socket<DefaultEventsMap, DefaultEventsMap>, next: (err?: ExtendedError | undefined) => void) => {
      const cookie = socket.request.headers.cookie

      if (!cookie) {
        throw new Error('No cookie available')
      }

      const parsedCookie = Cookie.parse(cookie)
      const { user } = Jwt.verify(parsedCookie.accessToken, ACCESS_TOKEN_SECRET) as DecodedToken

      if (!user._id) {
        throw new Error('No user is available')
      }

      /**
       * Read here to learn more as to why im creating a new socket: https://stackoverflow.com/questions/48058924/saving-more-data-on-socket-io-object-in-typescript
       */
      const newSocket = <SecureSocket>socket
      newSocket.userId = user._id

      /* Now Save the users connnection in mongodb to keep track of who is online easier */
      return Connect.findOne({ userId: new mongoose.Types.ObjectId(newSocket.userId) }).exec(async (err, conn) => {
        if (err)
          throw new Error('No user is available')
        if (conn) {
          return next()
        } else {
          const newConnection = new Connect({
            socketId: socket.id,
            userId: user._id
          })

          await newConnection.save()

          next()
        }
      })

    }

  /* Validate the socket connection using cookie authentication */
  TribeNamespace.use((socket, next) => validationMiddleware(socket, next));
  ChatNamespace.use((socket, next) => validationMiddleware(socket, next))

  /* Tribe Namespace for events like notifications */
  TribeNamespace.on('connection', socket => {
    const newSocket = <SecureSocket>socket

    socket.on('join tribe rooms', (rooms: string) => {
      if(rooms.length) newSocket.join(rooms)
    })

  })

  /* Chat namespace for chat functionality */
  ChatNamespace.on('connection', socket => {
    const newSocket = <SecureSocket>socket

    /* Join all chat rooms that a user is apart of */
    socket.on('join rooms', (rooms: string[]) => {
      if(rooms.length) newSocket.join(rooms)
    })

    /* Event handler for new conversations started within a tribe */
    socket.on('new room', async (room: IChatRoom, message: string) => {
      /* Check for permissions somewhere in here */
      const newRoom = new ChatRoom(room)

      const tmpMessage = {
        user: newSocket.userId,
        room: newRoom._id as string,
        read: false,
        timeSent: new Date().toISOString(),
        content: message
      }

      const newMessage = new Chat(tmpMessage)

      try {
        await newMessage.save()

        const newMessageId = newMessage._id as string
        const newMessageObjectId = new mongoose.Types.ObjectId(newMessageId)

        newRoom.messages.push(newMessageObjectId)

        await newRoom.save()

        socket.join(newRoom._id as string)

        /* Emit a notification to the other user about the new message */

        /* Check and see if the other user is online by searching for their connection in the DB */
        const otherUsersIndex = room.users.findIndex((id) => id !== new mongoose.Types.ObjectId(newSocket.userId))
        const otherUsersId = room.users[otherUsersIndex]

        const otherUserConnection = await Connect.findOne({ userId: otherUsersId })

        /* If the other user is online, make the other user join the newly created chat room */
        if (otherUserConnection) {
          io.to(otherUserConnection.socketId).socketsJoin(newRoom._id as string)
        }

        const user = await User.findById(newMessage.user)

        const clientMessage = {
          user: {
            _id: user?._id,
            name: user?.name,
            avatar: user?.avatar || undefined
          },
          room: newMessage.room,
          _id: newMessage._id,
          read: newMessage.read,
          content: newMessage.content,
          timeSent: newMessage.timeSent
        }
        /* Broadcast the message to the chat room */
        ChatNamespace.in(newRoom._id as string).emit('recieve message', clientMessage)
      } catch (err) {
        console.log(err)
      }
    })

    /* Event handler for sending a message in an already existing chat room */
    socket.on('new message', async (roomId: string, message: string) => {
      const tmpMessage = {
        user: newSocket.userId,
        room: roomId,
        read: false,
        timeSent: new Date().toISOString(),
        content: message
      }

      try {
        /* Search for the chat room to make changes */
        const room = await ChatRoom.findById(roomId)

        /* If no room do nothing (and emit a null value to the sender?) */
        if (!room) {

        } else {
          /* Otherwise create a new chat object and save it, push the chat id to the room object, save the room object, and send the message to the user */
          const newMessage = new Chat(tmpMessage)
          await newMessage.save()

          room.messages.push(new mongoose.Types.ObjectId(newMessage._id as string))

          await room.save()
          const user = await User.findById(newMessage.user)

          const clientMessage = {
            user: {
              _id: user?._id,
              name: user?.name,
              avatar: user?.avatar || undefined
            },
            room: newMessage.room,
            _id: newMessage._id,
            read: newMessage.read,
            content: newMessage.content,
            timeSent: newMessage.timeSent
          }

          /* Emit the message to the room */
          ChatNamespace.in(roomId).emit('recieve message', clientMessage)
        }

      } catch (err) {
        console.log(err)
        socket.emit('new-message-error', 'something went wrong')
      }
    })
  })
}
