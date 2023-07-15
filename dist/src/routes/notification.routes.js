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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const notifications_1 = __importDefault(require("../models/notifications"));
const NotificationRouter = express_1.default.Router();
/* Get all of a tribes notifications based on the TribeId */
NotificationRouter.get('/:tribeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tribeId } = req.params;
    try {
        const objectId = new mongoose_1.default.Types.ObjectId(tribeId);
        const tribeNotifications = yield notifications_1.default.find({ 'reciever': objectId }).populate('sender', ['name', 'avatar']);
        return res.json({
            ok: true,
            message: 'Notifications found',
            notifications: tribeNotifications
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: 'There was an error searching for the notifications, please try again',
            ok: false
        });
    }
}));
/* Read notifications upon viewing it */
NotificationRouter.put('/read', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { notificationIds, userId } = req.body;
    try {
        /* Find all the notifications in an array */
        const notifications = yield notifications_1.default.find({ '_id': { $in: notificationIds } });
        /* IF there are no notifications return */
        if (!notifications.length) {
            return res.json({
                ok: false,
                message: 'No notifications available',
            });
        }
        /* Transverse the array to read all the notifications */
        for (let i = 0; i < notifications.length; i++) {
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            /* Check if a user has already read the notification */
            const isRead = notifications[i].read_by.findIndex(user => String(user.userId) === String(userObjectId));
            if (isRead === 0)
                return;
            /* if the user has not read the notification, go ahead and push them into the array */
            notifications[i].read_by.push({
                userId,
                dateRead: new Date().toISOString()
            });
            yield notifications[i].save();
        }
        return res.json({
            ok: true,
            message: 'Notifications Updated',
        });
    }
    catch (err) {
        console.log(err);
    }
}));
/* Get all of a tribes unread notifications for a user */
NotificationRouter.get('/unread/:tribeId/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tribeId, userId } = req.params;
    try {
        const objectId = new mongoose_1.default.Types.ObjectId(tribeId);
        const tribeNotifications = yield notifications_1.default.find({ 'reciever': objectId }).populate('sender', ['name', 'avatar']);
        const unreadNotifications = tribeNotifications.filter(notification => {
            const { read_by } = notification;
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            const userIndex = read_by.findIndex(({ userId: id }) => String(id) === String(userObjectId));
            if (userIndex !== 0) {
                return notification._id;
            }
            return;
        });
        console.log(unreadNotifications);
        return res.json({
            ok: true,
            message: 'Notifications found',
            notifications: unreadNotifications
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: 'There was an error searching for the notifications, please try again',
            ok: false
        });
    }
}));
exports.default = NotificationRouter;
//# sourceMappingURL=notification.routes.js.map