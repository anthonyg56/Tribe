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
exports.MemberStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var MemberStatus;
(function (MemberStatus) {
    MemberStatus[MemberStatus["Owner"] = 0] = "Owner";
    MemberStatus[MemberStatus["Admin"] = 1] = "Admin";
    MemberStatus[MemberStatus["Member"] = 2] = "Member";
})(MemberStatus = exports.MemberStatus || (exports.MemberStatus = {}));
;
;
const TribeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        _publicId: {
            type: String
        },
        url: {
            type: String
        },
    },
    description: {
        type: String,
        required: true,
    },
    rules: [{
            text: {
                type: String
            }
        }],
    roles: [{
            name: {
                type: String,
                required: true
            },
            status: {
                type: Number,
                required: true
            },
            color: {
                type: String,
                required: true
            },
            createdBy: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            },
            createdOn: {
                type: String,
                default: new Date().toISOString()
            },
            defaultRole: {
                type: Boolean,
                require: true,
            },
            permissions: {
                general: {
                    editRules: Boolean,
                    editTribe: Boolean,
                },
                membership: {
                    createInvite: Boolean,
                    acceptAndRejectinvite: Boolean,
                    removeMembers: Boolean,
                    createRoles: Boolean,
                    editRolesAndPermissions: Boolean,
                },
                posts: {
                    createPosts: Boolean,
                    commentOnPosts: Boolean,
                    createATimeline: Boolean,
                    removePosts: Boolean,
                },
                chats: {
                    sendChats: Boolean,
                },
            },
        }],
    members: [{
            _id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User',
            },
            status: {
                type: Number,
                default: MemberStatus.Member
            },
            role: {
                type: mongoose_1.default.Schema.Types.ObjectId,
            },
            aggreedtoRules: {
                type: Boolean,
                default: false
            },
            memberSince: {
                type: String,
                default: new Date().toISOString()
            }
        }],
    createdOn: {
        type: String,
        default: new Date().toISOString()
    }
});
const TribeModel = mongoose_1.default.model('Tribe', TribeSchema);
exports.default = TribeModel;
//# sourceMappingURL=tribe.js.map