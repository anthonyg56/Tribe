"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = __importDefault(require("cookie"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const chats_1 = __importDefault(require("../models/chats"));
const chatRoom_1 = __importDefault(require("../models/chatRoom"));
const connect_1 = __importDefault(require("../models/connect"));
const user_1 = __importDefault(require("../models/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || '';
exports.default = (io) => {
    /* Create two namespaces for different events happening within a tribe */
    const TribeNamespace = io.of('/tribe');
    const ChatNamespace = io.of('/chat');
    /* Validates a socket connection through cookie authentication */
    const validationMiddleware = (socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        const cookie = socket.request.headers.cookie;
        if (!cookie) {
            throw new Error('No cookie available');
        }
        const parsedCookie = cookie_1.default.parse(cookie);
        const { user } = jsonwebtoken_1.default.verify(parsedCookie.accessToken, ACCESS_TOKEN_SECRET);
        if (!user._id) {
            throw new Error('No user is available');
        }
        /**
         * Read here to learn more as to why im creating a new socket: https://stackoverflow.com/questions/48058924/saving-more-data-on-socket-io-object-in-typescript
         */
        const newSocket = socket;
        newSocket.userId = user._id;
        /* Now Save the users connnection in mongodb to keep track of who is online easier */
        return connect_1.default.findOne({ userId: new mongoose_1.default.Types.ObjectId(newSocket.userId) }).exec((err, conn) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                throw new Error('No user is available');
            if (conn) {
                return next();
            }
            else {
                const newConnection = new connect_1.default({
                    socketId: socket.id,
                    userId: user._id
                });
                yield newConnection.save();
                next();
            }
        }));
    });
    /* Validate the socket connection using cookie authentication */
    TribeNamespace.use((socket, next) => validationMiddleware(socket, next));
    ChatNamespace.use((socket, next) => validationMiddleware(socket, next));
    /* Tribe Namespace for events like notifications */
    TribeNamespace.on('connection', socket => {
        const newSocket = socket;
        socket.on('join tribe rooms', (rooms) => {
            if (rooms.length)
                newSocket.join(rooms);
        });
    });
    /* Chat namespace for chat functionality */
    ChatNamespace.on('connection', socket => {
        const newSocket = socket;
        /* Join all chat rooms that a user is apart of */
        socket.on('join rooms', (rooms) => {
            if (rooms.length)
                newSocket.join(rooms);
        });
        /* Event handler for new conversations started within a tribe */
        socket.on('new room', (room, message) => __awaiter(void 0, void 0, void 0, function* () {
            /* Check for permissions somewhere in here */
            const newRoom = new chatRoom_1.default(room);
            const tmpMessage = {
                user: newSocket.userId,
                room: newRoom._id,
                read: false,
                timeSent: new Date().toISOString(),
                content: message
            };
            const newMessage = new chats_1.default(tmpMessage);
            try {
                yield newMessage.save();
                const newMessageId = newMessage._id;
                const newMessageObjectId = new mongoose_1.default.Types.ObjectId(newMessageId);
                newRoom.messages.push(newMessageObjectId);
                yield newRoom.save();
                socket.join(newRoom._id);
                /* Emit a notification to the other user about the new message */
                /* Check and see if the other user is online by searching for their connection in the DB */
                const otherUsersIndex = room.users.findIndex((id) => id !== new mongoose_1.default.Types.ObjectId(newSocket.userId));
                const otherUsersId = room.users[otherUsersIndex];
                const otherUserConnection = yield connect_1.default.findOne({ userId: otherUsersId });
                /* If the other user is online, make the other user join the newly created chat room */
                if (otherUserConnection) {
                    io.to(otherUserConnection.socketId).socketsJoin(newRoom._id);
                }
                const user = yield user_1.default.findById(newMessage.user);
                const clientMessage = {
                    user: {
                        _id: user === null || user === void 0 ? void 0 : user._id,
                        name: user === null || user === void 0 ? void 0 : user.name,
                        avatar: (user === null || user === void 0 ? void 0 : user.avatar) || undefined
                    },
                    room: newMessage.room,
                    _id: newMessage._id,
                    read: newMessage.read,
                    content: newMessage.content,
                    timeSent: newMessage.timeSent
                };
                /* Broadcast the message to the chat room */
                ChatNamespace.in(newRoom._id).emit('recieve message', clientMessage);
            }
            catch (err) {
                console.log(err);
            }
        }));
        /* Event handler for sending a message in an already existing chat room */
        socket.on('new message', (roomId, message) => __awaiter(void 0, void 0, void 0, function* () {
            const tmpMessage = {
                user: newSocket.userId,
                room: roomId,
                read: false,
                timeSent: new Date().toISOString(),
                content: message
            };
            try {
                /* Search for the chat room to make changes */
                const room = yield chatRoom_1.default.findById(roomId);
                /* If no room do nothing (and emit a null value to the sender?) */
                if (!room) {
                }
                else {
                    /* Otherwise create a new chat object and save it, push the chat id to the room object, save the room object, and send the message to the user */
                    const newMessage = new chats_1.default(tmpMessage);
                    yield newMessage.save();
                    room.messages.push(new mongoose_1.default.Types.ObjectId(newMessage._id));
                    yield room.save();
                    const user = yield user_1.default.findById(newMessage.user);
                    const clientMessage = {
                        user: {
                            _id: user === null || user === void 0 ? void 0 : user._id,
                            name: user === null || user === void 0 ? void 0 : user.name,
                            avatar: (user === null || user === void 0 ? void 0 : user.avatar) || undefined
                        },
                        room: newMessage.room,
                        _id: newMessage._id,
                        read: newMessage.read,
                        content: newMessage.content,
                        timeSent: newMessage.timeSent
                    };
                    /* Emit the message to the room */
                    ChatNamespace.in(roomId).emit('recieve message', clientMessage);
                }
            }
            catch (err) {
                console.log(err);
                socket.emit('new-message-error', 'something went wrong');
            }
        }));
    });
};
//# sourceMappingURL=socketio.js.map