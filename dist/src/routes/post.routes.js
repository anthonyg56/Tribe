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
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("../utils/multer"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const posts_1 = __importDefault(require("../models/posts"));
const tribe_1 = __importDefault(require("../models/tribe"));
const PostRouter = express_1.default.Router();
PostRouter.post('/post', (0, multer_1.default)().single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user, file } = req;
    console.log("hi");
    /* Search for Tribe */
    return tribe_1.default.findById(body._tribeId).exec((err, tribe) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.status(404).json({
                message: "there was an error searching for the tribe",
            });
        }
        else if (!tribe) {
            return res.status(404).json({
                message: "No tribe was found"
            });
        }
        // const memberIndex = tribe.members.findIndex(({ _id }) => _id === user?._id)
        // if (!memberIndex) {
        //   return res.json({
        //     message: 'User is not member of the tribe'
        //   })
        // }
        // const member = tribe.members[memberIndex]
        // const roleIndex = tribe.roles.findIndex(({ _id }) => _id === member.role)
        // if (!roleIndex && member.status !== MemberStatus.Owner) {
        //   return res.json({
        //     message: 'User does not have permission, please select a role'
        //   })
        // }
        // const role = tribe.roles[roleIndex]
        // console.log(member.status)
        // if (member.status !== MemberStatus.Owner) {
        //   if (!role.permissions.posts.createPosts) {
        //     return res.json({
        //       message: 'User does not have permission to create a post'
        //     })
        //   }
        // }
        const createdOnTimeStamp = new Date().toISOString();
        console.log(file);
        /* Check to see if there were any images sent to the server, if so then upload to cloudinary */
        if (file) {
            const results = yield cloudinary_1.default.uploader.upload(file.path).then(response => {
                // /* Remove the file from the folder */
                fs_1.default.unlink(file.path, (err) => {
                    if (err)
                        console.log(err);
                });
                console.log("made it to success");
                return response;
            })
                .catch(err => {
                console.log("made it to error");
                console.log(err);
            });
            if (results) {
                const newPost = new posts_1.default({
                    _tribeId: tribe._id,
                    _userId: user === null || user === void 0 ? void 0 : user._id,
                    content: body.content,
                    image: {
                        url: results.secure_url,
                        pubicId: results.public_id,
                    },
                    createdOn: createdOnTimeStamp,
                });
                return yield newPost.save().then(data => {
                    /* in here, send notification to client a post has been made */
                    return res.json({
                        post: data
                    });
                })
                    .catch(err => res.status(404).json({ message: 'there was an error', error: err }));
            }
        }
        const newPost = new posts_1.default({
            _tribeId: tribe._id,
            _userId: user === null || user === void 0 ? void 0 : user._id,
            content: body.content,
            createdOn: createdOnTimeStamp
        });
        return yield newPost.save().then(data => {
            /* in here, send notification to client a post has been made */
            return res.json({
                post: data
            });
        })
            .catch(err => res.status(404).json({ message: 'there was an error', error: err }));
    }));
}));
PostRouter.get('/posts/:tribeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tribeId } = req.params;
    const objectId = new mongoose_1.default.Types.ObjectId(tribeId);
    return posts_1.default
        .find({ '_tribeId': objectId })
        .sort('-createdOn')
        .populate('_userId', ['_id', 'avatar', 'name'])
        .exec((err, posts) => {
        if (err) {
            console.log(err);
            return res.json({
                message: "there was an error searching for the post",
                error: err,
                posts: []
            });
        }
        else if (!posts) {
            return res.json({
                message: "No posts were found",
                error: true,
                post: []
            });
        }
        return res.json({
            error: false,
            message: 'Posts successfully found',
            posts
        });
    });
}));
/* Update Likes */
PostRouter.put('/:postId/like', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { userId } = req.body;
    posts_1.default.findById(postId).exec((err, post) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.json({
                ok: false,
                message: "there was an error searching for the post",
                error: err
            });
        }
        else if (!post) {
            return res.json({
                ok: false,
                message: "No post was found"
            });
        }
        const index = post.likes.findIndex(data => data.userId == userId);
        if (index === -1) {
            post.likes.push({
                userId: userId
            });
        }
        else {
            post.likes.splice(index, 1);
        }
        return yield post
            .save()
            .then(data => res.json({
            ok: true,
            message: 'Post successfully updated',
            post: data
        })).catch(err => res.json({
            ok: false,
            message: 'There was an error saving the post',
        }));
    }));
}));
/* Remove a post */
PostRouter.delete('/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        const deleteRes = yield posts_1.default.deleteOne({ _id: postId });
        /* Is this redundant...? */
        const wasDeleted = deleteRes.deletedCount === 1 ? true : false;
        if (wasDeleted) {
            return res.json({
                message: 'Post successfully deleted',
                ok: true
            });
        }
        else {
            return res.json({
                message: "Comment couldn't be deleted",
                ok: false
            });
        }
    }
    catch (e) {
        return res.json({
            message: "There was an error trying to delete the comment, please try again",
            ok: false
        });
    }
}));
exports.default = PostRouter;
//# sourceMappingURL=post.routes.js.map