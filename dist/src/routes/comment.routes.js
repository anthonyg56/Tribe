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
const posts_1 = __importDefault(require("../models/posts"));
const comment_1 = __importDefault(require("../models/comment"));
const CommentRouter = express_1.default.Router();
/* Create a comment */
CommentRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user } = req;
    try {
        const post = yield posts_1.default.findById(body.postId);
        if (!post) {
            return res.json({
                message: 'Unable to create comment, post does not exist',
                ok: false
            });
        }
        ;
        const newComment = new comment_1.default({
            _userId: user === null || user === void 0 ? void 0 : user._id,
            _postId: post._id,
            content: body.content
        });
        yield newComment.save();
        post.comments.push(newComment._id);
        yield post.save();
        const populatedComment = yield comment_1.default
            .findById(newComment._id)
            .populate('_userId', ['avatar', 'name', '_id']);
        return res.json({
            message: 'comment created',
            ok: true,
            newComment: populatedComment
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: 'There was an error uploading the comment, please try again',
            ok: false
        });
    }
}));
/* Get all comments of a post */
CommentRouter.get('/comments/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        const objectId = new mongoose_1.default.Types.ObjectId(postId);
        const comments = yield comment_1.default
            .find({ '_postId': objectId })
            .sort('-createdOn')
            .populate('_userId', ['avatar', 'name', '_id']);
        return res.json({
            comments,
            message: 'found comments',
            error: false
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: 'There was an error searching for the comments',
            comments: [],
            error: err
        });
    }
}));
/* Remove a comment */
CommentRouter.delete('/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    try {
        const deleteRes = yield comment_1.default.deleteOne({ _id: commentId });
        /* Is this redundant...? */
        const wasDeleted = deleteRes.deletedCount === 1 ? true : false;
        if (wasDeleted) {
            return res.json({
                message: 'Comment was successfully deleted',
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
/* Update Likes */
CommentRouter.put('/:commentId/like', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const { userId } = req.body;
    comment_1.default.findById(commentId).exec((err, comment) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.json({
                ok: false,
                message: "there was an error searching for the comment",
                error: err
            });
        }
        else if (!comment) {
            return res.json({
                ok: false,
                message: "No comment was found"
            });
        }
        const index = comment.likes.findIndex(data => data == userId);
        if (index === -1) {
            comment.likes.push(userId);
        }
        else {
            comment.likes.splice(index, 1);
        }
        return yield comment
            .save()
            .then(data => res.json({
            ok: true,
            message: 'Post successfully updated',
            comment: data
        })).catch(err => res.json({
            ok: false,
            message: 'There was an error saving the post',
        }));
    }));
}));
exports.default = CommentRouter;
//# sourceMappingURL=comment.routes.js.map