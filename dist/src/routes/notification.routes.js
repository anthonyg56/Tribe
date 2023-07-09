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
    console.log(req.body);
    console.log(userId);
    try {
        const notifications = yield notifications_1.default.find({ '_id': { $in: notificationIds } });
        if (!notifications) {
            return res.json({
                ok: false,
                message: 'No notifications available',
            });
        }
        for (let i = 0; i < notifications.length; i++) {
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
exports.default = NotificationRouter;
//# sourceMappingURL=notification.routes.js.map