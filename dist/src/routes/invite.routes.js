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
const invites_1 = __importStar(require("../models/invites"));
const tribe_1 = __importStar(require("../models/tribe"));
const user_1 = __importDefault(require("../models/user"));
const notifications_1 = __importStar(require("../models/notifications"));
const InviteRouter = express_1.default.Router();
/* Create Invite for users with an account */
InviteRouter.post('/invite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = req;
    const { toUserId, tribeId } = body;
    try {
        /* Check and see if there was an invite sent out to a user from the same tribe */
        const inv = yield invites_1.default.findOne({ to: toUserId, tribe: tribeId });
        if (inv) {
            return res.json({
                message: 'User has already been invited to this tribe',
                ok: false
            });
        }
        /* Find all entities were making changes to */
        const toUser = yield user_1.default.findById(toUserId);
        const tribe = yield tribe_1.default.findById(tribeId);
        if (!toUser) {
            return res.status(404).json({ message: "No user found", ok: false });
        }
        else if (!tribe) {
            return res.status(404).json({ message: "No tribe found", ok: false });
        }
        /* Check and see if the user is apart of the tribe already before sending out an invite */
        const userIndex = tribe.members.findIndex(({ _id }, index) => String(_id) === String(toUser._id));
        console.log(userIndex);
        if (userIndex !== -1) {
            return res.json({
                message: 'User is already apart of this tribe',
                ok: false
            });
        }
        /* Check permissions */
        // const memberIndex = tribe.members.findIndex(({ _id }) => _id === user?._id)
        // const member = tribe.members[memberIndex]
        // const roleIndex = tribe.roles.findIndex(({ _id }) => _id === member.role)
        // const role = tribe.roles[roleIndex]
        // if(!role.permissions.membership.createInvite && member.status !== MemberStatus.Owner) {
        //   return res.json({
        //     message: 'User does not have permission to create invites',
        //     ok: false
        //   })
        // }
        /* If everything is good, create an invite now */
        const invite = new invites_1.default({
            to: toUser.id,
            email: toUser.email,
            from: user === null || user === void 0 ? void 0 : user._id,
            tribe: tribe.id,
        });
        /* Save it before pushing it to the user document */
        yield invite.save();
        // const mailOptions = {
        //   from: process.env.SMTP_EMAIL,
        //   to: toUser.email,
        //   subject: `You've been invited to join ${tribe.name}`,
        //   text: `Hello,\n\n Someone has invite you to join their tribe ${tribe.name}. Accept the invite and hop right into things by clicking the link:`
        // }
        // await Transporter.sendMail(mailOptions)
        /* Push and then save */
        toUser.invites.push(invite.id);
        yield toUser.save();
        /* TODO: Emit notification with a web socket */
        return res.json({
            message: `${toUser.name} was invited to ${tribe.name}!`,
            ok: true
        });
    }
    catch (err) {
        console.log(err);
        return res.status(404).json({
            message: 'There was an error',
            ok: false
        });
    }
}));
/* Create invite for users who dont have an account and send it through email */
InviteRouter.post('/email', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = req;
    const { email, tribeId } = body;
    try {
        const tribe = yield tribe_1.default.findById(tribeId);
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        else if (!tribe) {
            return res.status(404).json({ message: "No tribe found" });
        }
        /* Check permissions */
        // const memberIndex = tribe.members.findIndex(({ _id }) => _id === user?._id)
        // const member = tribe.members[memberIndex]
        // const roleIndex = tribe.roles.findIndex(({ _id }) => _id === member.role)
        // const role = tribe.roles[roleIndex]
        // if(!role.permissions.membership.createInvite && member.status !== MemberStatus.Owner) {
        //   return res.json({
        //     message: 'User does not have permission to create invites',
        //     ok: false
        //   })
        // }
        const invite = new invites_1.default({
            email: email,
            from: user === null || user === void 0 ? void 0 : user._id,
            tribe: tribe.id,
        });
        yield invite.save();
        // const mailOptions = {
        //   from: process.env.SMTP_EMAIL,
        //   to: email,
        //   subject: `You've been invited to join ${tribe.name}`,
        //   text: `Hello,\n\n Someone has invite you to join their tribe ${tribe.name}. Accept the invite and hop right into things by clicking the link:`
        // }
        // await Transporter.sendMail(mailOptions)
        return res.json({
            message: `${email} was invited to ${tribe.name}!`
        });
    }
    catch (err) {
        console.log(err);
        /* Oh noooo */
        return res.json({
            message: 'There was an error, please try again'
        });
    }
}));
/* Accept Invite */
InviteRouter.put('/accept', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { inviteId } = req.body;
    try {
        /* Find the invite to grab the data we need */
        const invite = yield invites_1.default.findById(inviteId);
        if (!invite) {
            return res.json({
                message: 'No invite was found',
                ok: false,
                userId: null
            });
        }
        /* Grab the user and tribe document to make the changes we need */
        const user = yield user_1.default.findById(invite.to);
        const tribe = yield tribe_1.default.findById(invite.tribe);
        if (!user) {
            return res.json({
                message: 'No user was found',
                ok: false,
                userId: null
            });
        }
        else if (!tribe) {
            return res.json({
                message: 'No tribe was found',
                ok: false,
                userId: null
            });
        }
        /* Accept the invite */
        invite.status = invites_1.InviteStatus.Accepted;
        /* Find the index of the invite in the user document and remove it */
        const inviteIndex = user.invites.indexOf(invite.id);
        if (inviteIndex > -1) {
            user.invites.splice(inviteIndex);
        }
        /* Find the default role of a tribe */
        // const defaultRoleIndex = tribe.roles.findIndex(({ defaultRole }) => defaultRole === true)
        // const defaultRole = tribe.roles[defaultRoleIndex]
        /* Add the tribe to the user document and the user to the tribe document */
        user.tribes.push(tribe.id);
        tribe.members.push({
            _id: user.id,
            status: tribe_1.MemberStatus.Member,
            aggreedToRules: false,
            memberSince: new Date().toISOString(),
            //role: defaultRole._id,
        });
        /* Save all changes made */
        yield user.save();
        yield tribe.save();
        yield invite.save();
        /* Push out a notification to the Tribe */
        const newNotification = new notifications_1.default({
            action: notifications_1.NotificationAction.AcceptedInvite,
            sender: user._id,
            reciever: tribe._id,
            message: `${user.name} has joined the Tribe!`
        });
        // newNotification.save().then(data => {
        //   const io = req.app.get('socketio')
        //   /* emit the notification to those connect to the client */
        //   io.of('tribe').in(tribe.id).emit('new notification', data)
        // })
        /* Notify client everything is alllll gooood */
        return res.json({
            message: `${user.name} is now apart of ${tribe.name}!`,
            ok: true,
            userId: user._id
        });
    }
    catch (err) {
        console.log(err);
        /* Oh noooo */
        return res.json({
            message: 'There was an error, please try again',
            ok: false,
            userId: null
        });
    }
}));
/* Reject Invite */
InviteRouter.put('/reject', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { inviteId } = req.body;
    try {
        const invite = yield invites_1.default.findById(inviteId);
        if (!invite) {
            return res.json({
                message: "No invite was found",
                ok: false,
                userId: null
            });
        }
        const user = yield user_1.default.findById(invite.to);
        if (!user) {
            return res.json({
                message: "No user was found",
                ok: false,
                userId: null
            });
        }
        invite.status = invites_1.InviteStatus.Rejected;
        const inviteIndex = user.invites.indexOf(invite.id);
        if (inviteIndex > -1) {
            user.invites.splice(inviteIndex);
        }
        yield user.save();
        yield invite.save();
        return res.json({
            message: 'Invite rejected and removed',
            ok: true,
            userId: user._id
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: 'There was an error, please try again',
            ok: false,
            userId: null
        });
    }
}));
/* Generate an invite link (?) */
InviteRouter.post('/generate', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { tribeId, userId } = req.body;
    try {
        const user = yield user_1.default.findById(userId);
        const tribe = yield tribe_1.default.findById(tribeId);
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        else if (!tribe) {
            return res.status(404).json({ message: "No tribe found" });
        }
        const invite = new invites_1.default({
            from: {
                user: user.id,
                tribe: tribe.id,
            }
        });
        yield invite.save();
        return res.json({
            message: `Invite to ${tribe.name} was created`,
            id: invite.id
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: 'There was an error, please try again'
        });
    }
}));
/* Validate Invite (?) */
InviteRouter.put('/validate', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
}));
exports.default = InviteRouter;
//# sourceMappingURL=invite.routes.js.map