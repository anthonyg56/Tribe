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
const passport_1 = __importDefault(require("passport"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_google_oauth_1 = __importDefault(require("passport-google-oauth"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const user_1 = __importDefault(require("../models/user"));
const token_1 = __importDefault(require("../models/token"));
const tribe_1 = __importStar(require("../models/tribe"));
const mongoose_1 = __importDefault(require("mongoose"));
const LocalStrategy = passport_local_1.default.Strategy;
const JWTStrategy = passport_jwt_1.default.Strategy;
const ExtractJWT = passport_jwt_1.default.ExtractJwt;
const GoogleStrategy = passport_google_oauth_1.default.OAuth2Strategy;
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => {
    user_1.default.findById(id, null, null, (err, user) => {
        done(err, user ? user : undefined);
    });
});
// Login Strategy
passport_1.default.use('local', new LocalStrategy({ usernameField: 'email' }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.default.findOne({ email: email })
        .then(user => {
        if (!user) {
            console.log('no user found');
            return done(null, false, { message: 'No User Found' });
        }
        else {
            bcrypt_1.default.compare(password, user.password, (err, isMatch) => {
                if (err)
                    throw err;
                if (!isMatch)
                    return done(null, false, { message: "Invalid email or password" });
                return done(null, user);
            });
        }
    })
        .catch(err => {
        return done(err, false, { message: err });
    });
})));
// Signup strategy
passport_1.default.use('signup', new LocalStrategy({ usernameField: "email", passReqToCallback: true }, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if a user has an account already with the email or username sent
    try {
        const user = yield user_1.default.findOne({ 'email': email });
        if (user) {
            console.log('found a user');
            return done(null, false, { message: "User found with that email already" });
        }
        console.log(req);
        const newTribe = new tribe_1.default({
            name: `${req.body.name}s Tribe`,
            description: 'This is your home tribe.',
        });
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
        const newUser = new user_1.default({
            name: req.body.name,
            email,
            password,
        });
        newUser.tribes.push(newTribe.id);
        newUser.save();
        newTribe.members.push({
            _id: new mongoose_1.default.Types.ObjectId(newUser._id),
            status: tribe_1.MemberStatus.Owner,
            aggreedToRules: false,
            memberSince: new Date().toISOString(),
        });
        newTribe.save();
        const token = new token_1.default({
            _userId: newUser._id,
            token: crypto_1.default.randomBytes(16).toString('hex'),
        });
        token.save();
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: 2525,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: newUser.email,
            subject: 'Account Verification Token',
            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/auth\/email\/confirm\/' + token.token + '.\n'
        };
        transporter.sendMail(mailOptions, function (err) {
            if (err) {
                return done(err.message, user);
            }
        });
        return done(null, newUser);
    }
    catch (err) {
        console.log(err);
        return done(err, false, { message: err });
    }
})));
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback',
}, (accessToke, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.default.findOne({ googleId: profile.id })
        .then(user => {
        return done(null, profile);
    })
        .catch(error => done(error));
})));
passport_1.default.use(new JWTStrategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, (token, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        done(null, token.user);
    }
    catch (error) {
        console.log('error');
        done(error);
    }
})));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map