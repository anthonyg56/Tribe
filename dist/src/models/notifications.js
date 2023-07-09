"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationAction = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var NotificationAction;
(function (NotificationAction) {
    NotificationAction["AcceptedInvite"] = "Accepted Invite";
})(NotificationAction = exports.NotificationAction || (exports.NotificationAction = {}));
const NotificationSchema = new mongoose_1.Schema({
    action: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    reciever: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Tribe',
        require: true,
    },
    message: {
        type: String,
        require: true,
    },
    read_by: [{
            userId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            },
            dateRead: {
                type: String,
                default: new Date().toISOString()
            }
        }],
    createdOn: {
        type: String,
        default: new Date().toISOString()
    }
});
const NotificationModel = mongoose_1.default.model('Notification', NotificationSchema);
exports.default = NotificationModel;
//# sourceMappingURL=notifications.js.map