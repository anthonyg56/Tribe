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
const fs_1 = __importDefault(require("fs"));
const tribe_1 = __importStar(require("../models/tribe"));
const user_1 = __importDefault(require("../models/user"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const multer_1 = __importDefault(require("../utils/multer"));
const tribe_2 = __importDefault(require("../models/tribe"));
const mongoose_1 = __importDefault(require("mongoose"));
const TribeRouter = express_1.default.Router();
/* Server route for creating a new Tribe */
TribeRouter.post('/new', (0, multer_1.default)().single('avatar'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, file, user } = req;
    console.log(body);
    let newTribe;
    if (file) {
        const results = yield cloudinary_1.default.uploader.upload(file.path);
        /* Remove the file from the folder */
        fs_1.default.unlink(file.path, (err) => {
            if (err)
                console.log(err);
        });
        newTribe = new tribe_1.default({
            name: body.name,
            description: body.description,
            avatar: {
                url: results.url,
                id: results.public_id,
            },
        });
    }
    else {
        newTribe = new tribe_1.default({
            name: body.name,
            description: body.description,
        });
    }
    /* Default roles that comes with a tribe */
    const adminRole = {
        name: 'admin',
        color: '#000000',
        defaultRole: false,
        status: tribe_1.MemberStatus.Admin,
        permissions: {
            general: {
                editRules: true,
                editTribe: true,
            },
            membership: {
                createRoles: true,
                createInvite: true,
                removeMembers: true,
                editRolesAndPermissions: true,
            },
            posts: {
                commentOnPosts: true,
                createATimeline: true,
                createPosts: true,
                removePosts: true,
            },
            chats: {
                sendChats: true,
            }
        }
    };
    const memberRole = {
        name: 'Member',
        color: '#000000',
        defaultRole: true,
        status: tribe_1.MemberStatus.Member,
        permissions: {
            general: {
                editRules: false,
                editTribe: false,
            },
            membership: {
                createRoles: false,
                createInvite: true,
                removeMembers: false,
                editRolesAndPermissions: false,
            },
            posts: {
                commentOnPosts: true,
                createATimeline: false,
                createPosts: true,
                removePosts: false,
            },
            chats: {
                sendChats: true,
            }
        }
    };
    newTribe.roles.push(adminRole);
    newTribe.roles.push(memberRole);
    console.log(user);
    user_1.default.findById(body._userId).exec((err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.json({ message: 'There was an error finding the user', error: err });
        }
        if (!user)
            return res.status(400).json({ error: "No user found" });
        user.tribes.push(newTribe.id);
        newTribe.members.push({
            _id: body._userId,
            status: tribe_1.MemberStatus.Owner,
            aggreedToRules: false,
            memberSince: new Date().toISOString(),
        });
        yield newTribe.save()
            .then(tribe => tribe)
            .catch(err => {
            console.log(err);
            return res.json({ message: 'There was an error saving the tribe', error: err });
        });
        const newTribeMetaData = {
            _id: newTribe._id,
            name: newTribe.name,
            avatar: newTribe.avatar,
        };
        return yield user
            .save()
            .then(user => {
            return res.json({ message: 'tribe uploaded and added to user document', newTribe: newTribeMetaData });
        })
            .catch(err => res.json({ message: 'There was an error saving the tribe to user', error: err }));
    }));
}));
TribeRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params, user } = req;
    return tribe_1.default
        .findById(params.id)
        .populate('members._id', ['_id', 'name', 'avatar'])
        .exec((err, tribe) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: "There was an error looking for the tribe" });
        }
        if (!tribe) {
            return res.status(400).json({ error: "No tribe found" });
        }
        return res.status(200).json({ message: "Found tribe", tribe, userId: user === null || user === void 0 ? void 0 : user._id });
    });
}));
/* Update rule for a tribe */
TribeRouter.put('/rules', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { tribeId, rules } = req.body;
    try {
        const tribe = yield tribe_1.default.findById(tribeId);
        if (!tribe) {
            return res.json({
                message: 'Tribe does not exist',
                ok: false
            });
        }
        // const memberIndex = tribe.members.findIndex(({ _id }) => _id == user?._id)
        // const member = tribe.members[memberIndex]
        // const roleIndex = tribe.roles.findIndex(({ _id }) => _id === member.role)
        // const role = tribe.roles[roleIndex]
        // if (role.permissions.general.editRules !== true && member.status !== MemberStatus.Owner) {
        //   return res.json({
        //     message: 'User does not have permission to change the rules',
        //     ok: false
        //   })
        // }
        console.log(rules);
        tribe.rules = rules;
        yield tribe.save();
        return res.json({
            rules: tribe.rules,
            message: 'rules successfully updated',
            ok: true
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: 'There was an error, please try again',
            ok: false
        });
    }
}));
/* Member agrees to rules of a tribe */
TribeRouter.put('/agree', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user } = req;
    if (!(user === null || user === void 0 ? void 0 : user._id))
        return res.json({
            message: 'There was an error, please try again',
            ok: false
        });
    try {
        const tribe = yield tribe_1.default.findById(body.tribeId);
        if (!tribe) {
            return res.json({
                message: 'No tribe was found, please try again',
                ok: false
            });
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(user._id);
        const userIndex = tribe.members.findIndex(({ _id }) => _id === userObjectId);
        if (!userIndex) {
            return res.json({
                message: `user is not apart of ${tribe.name}`,
                ok: false
            });
        }
        else if (tribe.members[userIndex].aggreedToRules === true) {
            return res.json({
                message: `user has already agreed to the rules of ${tribe.name}`,
                ok: false
            });
        }
        tribe.members[userIndex].aggreedToRules === true;
        yield tribe.save();
        return res.json({
            message: `user has aggreed to the rules of ${tribe.name}`,
            ok: true
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: 'There was an error, please try again.',
            ok: false
        });
    }
}));
// /* Create a new role within a tribe */
// TribeRouter.post('/role', async (req, res) => {
//   const { user, body } = req
//   const { tribeId, newRole }: { tribeId: string; newRole: ITribeRole } = body
//   try {
//     const tribe = await Tribe.findById(tribeId)
//     if (!tribe) {
//       return res.json({
//         message: 'No tribe was found, please try again',
//         ok: false
//       })
//     }
//     /* Make sure who ever is creating a role has the permission to do so */
//     const memberIndex = tribe.members.findIndex(({ _id }) => _id == user?._id)
//     const member = tribe.members[memberIndex]
//     const roleIndex = tribe.roles.findIndex(({ _id }) => _id === member.role)
//     const role = tribe.roles[roleIndex]
//     if (!role.permissions.membership.createRoles && member.status !== MemberStatus.Owner) {
//       return res.json({
//         message: 'User does not have permissions to create roles',
//         ok: false
//       })
//     }
//     tribe.roles.push(newRole)
//     await tribe.save()
//     return res.json({
//       message: "Role was successfully pushed",
//       ok: true
//     })
//   } catch (e) {
//     console.log(e)
//     return res.json({
//       message: 'There was an error, please try again',
//       ok: false
//     })
//   }
// })
/* Edit roles & Permissions */
TribeRouter.put('/role', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = req;
    if (!(user === null || user === void 0 ? void 0 : user._id))
        return res.json({
            message: 'There was an error, please try again',
            ok: false
        });
    const { tribeId, newRoleProps } = body;
    try {
        const tribe = yield tribe_1.default.findById(tribeId);
        if (!tribe) {
            return res.json({
                message: 'No tribe was found, please try again',
                ok: false
            });
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(user._id);
        /* Make sure who ever is creating a role has the permission to do so */
        const memberIndex = tribe.members.findIndex(({ _id }) => _id == userObjectId);
        const member = tribe.members[memberIndex];
        const userRoleIndex = tribe.roles.findIndex(({ _id }) => _id === member.role);
        const userRole = tribe.roles[userRoleIndex];
        if (!userRole.permissions.membership.editRolesAndPermissions && member.status !== tribe_1.MemberStatus.Owner) {
            return res.json({
                message: 'User does not have permissions to create roles',
                ok: false
            });
        }
        const roleIndex = tribe.roles.findIndex(({ _id }) => String(_id) === String(newRoleProps._id));
        tribe.roles[roleIndex] = newRoleProps;
        yield tribe.save();
        return res.json({
            message: "Role was successfully pushed",
            ok: true
        });
    }
    catch (e) {
        console.log(e);
        return res.json({
            message: 'There was an error, please try again',
            ok: false
        });
    }
}));
/* Let a user select a role */
// TribeRouter.put('role/user', async (req, res) => {
//   const { body, user } = req.body
//   const { tribeId, roleId } = body
//   try {
//     /* Find all entities were making changes to */
//     const tribe = await Tribe.findById(tribeId)
//     if(!tribe) {
//       return res.status(404).json({ message: "No tribe found" })
//     }
//     /* Check permissions */
//     const memberIndex = tribe.members.findIndex(({ _id }) => _id === user?._id)
//     const member = tribe.members[memberIndex]
//     const roleIndex = tribe.roles.findIndex(({ _id }) => _id === roleId)
//     const role = tribe.roles[roleIndex]
//     if(!role.permissions.membership. && member.status !== MemberStatus.Owner) {
//       return res.json({
//         message: 'User does not have permission to create invites',
//         ok: false
//       })
//     }
//   }
// })
TribeRouter.delete('/member', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tribeId, memberId } = req.body;
    try {
        const tribe = yield tribe_2.default.findById(tribeId);
        if (!tribe) {
            return res.json({
                message: 'Unable to remove member, no tribe available',
                ok: false
            });
        }
        const memberIndex = tribe.members.findIndex(({ _id }) => String(_id) === String(memberId));
        if (!memberIndex) {
            return res.json({
                message: 'Unable to remove member because they are not a member of the tribe',
                ok: false
            });
        }
        tribe.members.splice(memberIndex, 1);
        yield tribe.save();
        return res.json({
            message: 'member removed from the tribe',
            ok: true
        });
    }
    catch (error) {
    }
}));
TribeRouter.put('/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tribeId, memberId, newStatus } = req.body;
    try {
        const tribe = yield tribe_2.default.findById(tribeId);
        if (!tribe) {
            return res.json({
                message: 'Unable to update status, no tribe available',
                ok: false
            });
        }
        const memberIndex = tribe.members.findIndex(({ _id }) => String(_id) === memberId);
        if (!memberIndex) {
            return res.json({
                message: 'Unable to update status, member is not apart of the tribe',
                ok: false
            });
        }
        const member = tribe.members[memberIndex];
        member.status = newStatus;
        yield tribe.save();
        return res.json({
            message: 'Member status successfully updated',
            ok: true
        });
    }
    catch (err) {
    }
}));
TribeRouter.put('/updateSettings/:tribeId', (0, multer_1.default)().single('avatar'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, params: { tribeId }, file } = req;
    try {
        if (file) {
            const uplodateResults = yield cloudinary_1.default.uploader.upload(file.path);
            /* Remove the file from the folder */
            fs_1.default.unlink(file.path, (err) => {
                if (err)
                    console.log(err);
            });
            delete body.image;
            const newBody = body;
            newBody.avatar = {
                url: uplodateResults.secure_url,
                id: uplodateResults.public_id
            };
            const results = yield tribe_2.default.updateOne({ _id: tribeId }, newBody);
            if (results.matchedCount >= 1) {
                return res.json({
                    message: "Tribe Settings Updated",
                    ok: true
                });
            }
            else {
                return res.json({
                    message: "there was an error updating the tribe settings",
                    ok: false
                });
            }
        }
        const results = yield tribe_2.default.updateOne({ _id: tribeId }, body);
        if (results.matchedCount >= 1) {
            return res.json({
                message: "Tribe Settings Updated",
                ok: true
            });
        }
        else {
            return res.json({
                message: "there was an error updating the tribe settings",
                ok: false
            });
        }
    }
    catch (e) {
        return res.json({
            message: "There was an error trying to delete the tribe, please try again",
            ok: false
        });
    }
}));
TribeRouter.delete('/:tribeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tribeId } = req.params;
    try {
        const deleteRes = yield tribe_2.default.deleteOne({ _id: tribeId });
        /* Remove the tribe from all users tribes */
        /* Is this redundant...? */
        const wasDeleted = deleteRes.deletedCount === 1 ? true : false;
        if (!wasDeleted) {
            return res.json({
                message: "Tribe couldn't be deleted",
                ok: false
            });
        }
        else {
            const tribeObjId = new mongoose_1.default.Types.ObjectId(tribeId);
            const users = yield user_1.default.updateMany({ tribes: tribeObjId }, { $pull: { tribes: tribeObjId } });
            if (users.matchedCount === 0) {
                return res.json({
                    message: 'Tribe was delete but no users were found within the tribe',
                    ok: true
                });
            }
            return res.json({
                message: 'Tribe successfully deleted',
                ok: true
            });
        }
    }
    catch (e) {
        return res.json({
            message: "There was an error trying to delete the tribe, please try again",
            ok: false
        });
    }
}));
exports.default = TribeRouter;
//# sourceMappingURL=tribe.routes.js.map