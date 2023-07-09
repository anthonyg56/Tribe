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
exports.InviteStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var InviteStatus;
(function (InviteStatus) {
    InviteStatus[InviteStatus["Pending"] = 0] = "Pending";
    InviteStatus[InviteStatus["Accepted"] = 1] = "Accepted";
    InviteStatus[InviteStatus["Rejected"] = 2] = "Rejected";
})(InviteStatus = exports.InviteStatus || (exports.InviteStatus = {}));
const InviteSchema = new mongoose_1.Schema({
    to: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    email: String,
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tribe: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Tribe',
        required: true
    },
    status: {
        type: Number,
        default: InviteStatus.Pending
    },
    createdOn: {
        type: String,
        default: new Date().toISOString()
    },
    lastUpdated: String,
});
InviteSchema.pre('save', function (next) {
    var invite = this;
    invite.lastUpdated = new Date().toISOString();
    next();
});
const Invite = mongoose_1.default.model('Invite', InviteSchema);
exports.default = Invite;
//# sourceMappingURL=invites.js.map