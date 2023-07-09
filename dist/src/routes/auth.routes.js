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
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const crypto_1 = __importDefault(require("crypto"));
// import stream from 'getstream'
/* Mongoose Models */
const token_1 = __importDefault(require("../models/token"));
const user_1 = __importDefault(require("../models/user"));
const accessTokenSecret = process.env.JWT_SECRET || '';
const AuthRouter = express_1.default.Router();
// const StreamClient = stream.connect(streamKey, streamSecret)
AuthRouter.get('/validate', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    user_1.default.findById(user === null || user === void 0 ? void 0 : user._id).exec((err, user) => {
        if (err) {
            return res.status(500).json({
                message: 'There was an error searching for the user'
            });
        }
        if (!user) {
            return res.status(404).json({
                message: 'No user was found'
            });
        }
        return res.json({
            id: user._id,
            homeTribe: user.tribes[0]
        });
    });
}));
AuthRouter.post('/login', [
    (0, express_validator_1.check)('email', 'Please enter a valid email address')
        .isEmail()
        .normalizeEmail(),
    //check('password', 'Please enter a password')
    //.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/)
    //.withMessage('Password must be a minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character')
], function (req, res, next) {
    // Check for validation errors in the request body
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(errors);
    }
    passport_1.default.authenticate('local', { session: false }, function (err, user, info) {
        if (err) {
            return res.json({ message: 'there was an error, please try again', ok: false });
        }
        if (!user) {
            return res.json({ message: "No user was found", ok: false });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.json({ message: 'there was an error, please try again', ok: false });
            }
            const body = {
                _id: user._id,
                email: user.email
            };
            const token = jsonwebtoken_1.default.sign({ user: body }, accessTokenSecret);
            res
                .cookie('accessToken', token, {
                httpOnly: true,
            });
            return res.json({
                id: user._id,
                ok: true
            });
        });
    })(req, res, next);
});
AuthRouter.post('/signup', [
    (0, express_validator_1.check)('email', 'Please enter a valid email address')
        .isEmail()
        .normalizeEmail(),
    (0, express_validator_1.check)('password', 'Please enter a password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/)
        .withMessage('Password must be a minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character')
], function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check for validation errors in the request body
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.json({
                message: 'Password does not meet requirements',
                ok: false
            });
        }
        passport_1.default.authenticate('signup', { session: false }, function (err, user, info) {
            if (err) {
                console.log(err);
                return res.json({
                    message: 'There was an error',
                    ok: false
                });
            }
            if (!user) {
                return res.json({ message: info, ok: false });
            }
            return res.json({
                id: user._id,
                ok: true
            });
        })(req, res, next);
    });
});
AuthRouter.post('/logout', function (req, res) {
    return req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.json({
                message: "There was an error trying to log you out"
            });
        }
        res.clearCookie('accessToken');
        res.clearCookie('connect.sid');
        return res.json({
            message: 'User logged out'
        });
    });
});
AuthRouter.post('/email/confirm/:token', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    token_1.default.findOne({ token: req.params.token }).exec(function (err, token) {
        if (err) {
            console.log(err);
            return res.json({
                message: 'There was an error, please try again'
            });
        }
        if (!token) {
            return res.status(400).send({
                type: 'not-verified',
                msg: 'We were unable to find a valid token. Your token my have expired.'
            });
        }
        user_1.default.findOne({ _id: token._userId.toString(), email: req.body.email }).exec(function (err, user) {
            if (err) {
                console.log(err);
                return res.json({
                    message: 'There was an error, please try again'
                });
            }
            if (!user) {
                return res.status(400).send({
                    type: 'no user',
                    msg: 'We were unable to find a user. Please try again.'
                });
            }
            if (user.emailVerified) {
                return res.status(400).send({
                    type: 'already-verified',
                    msg: 'This user has already been verified.'
                });
            }
            user.emailVerified = true;
            user
                .save()
                .then(user => user)
                .catch(err => {
                next(err);
            });
        });
    });
}));
AuthRouter.post('/email/resend', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        user_1.default.findOne({ email: req.body.email }).exec(function (err, user) {
            if (err) {
                console.log(err);
                return res.json({
                    message: 'There was an error, please try again'
                });
            }
            if (!user)
                return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
            if (user.emailVerified)
                return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
            // Create a verification token, save it, and send email
            const token = new token_1.default({
                _userId: user._id,
                token: crypto_1.default.randomBytes(16).toString('hex')
            });
            // Save the token
            token.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ msg: err.message });
                }
                // Send the email
                // const transporter = nodemailer.createTransport({
                //   host: process.env.SMTP_HOST,
                //   port: 2525,
                //   auth: {
                //     user: process.env.SMTP_USER,
                //     pass: process.env.SMTP_PASSWORD
                //   }
                // })
                // const mailOptions = {
                //   from: process.env.SMTP_EMAIL,
                //   to: user.email,
                //   subject: 'Account Verification Token',
                //   text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/auth\/email\/confirm\/' + token.token + '.\n'
                // }
                // transporter.sendMail(mailOptions, function (err) {
                //     if (err) {
                //       console.log(err)
                //       return res.status(500).send({ msg: err.message });
                //     }
                //     res.status(200).send('A verification email has been sent to ' + user.email + '.');
                // });
            });
        });
    });
});
AuthRouter.get('/google', passport_1.default.authenticate('google', { scope: 'profile' }));
AuthRouter.get('/google/callback', passport_1.default.authenticate('google'), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.json({ user: req.user });
    });
});
exports.default = AuthRouter;
//# sourceMappingURL=auth.routes.js.map