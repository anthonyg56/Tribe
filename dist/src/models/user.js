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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_WORK_FACTOR = 10;
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        // validate: {
        //   validator: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        //   message: 'password does not meet requirements'
        // }
    },
    avatar: {
        cloudinaryId: {
            type: String,
            require: true
        },
        url: {
            type: String,
            require: true
        },
        required: false
    },
    createdOn: {
        type: String,
        default: new Date().toISOString()
    },
    tribes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Tribe'
        }],
    invites: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Invite'
        }]
});
UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt_1.default.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err)
            return next(err);
        // hash the password along with our new salt
        bcrypt_1.default.hash(user.password, salt, function (err, hash) {
            if (err)
                return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt_1.default.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    });
};
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
//# sourceMappingURL=user.js.map