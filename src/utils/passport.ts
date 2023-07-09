import passport from 'passport'
import bcrypt from 'bcrypt'
import passportLocal from 'passport-local'
import passportJwt from 'passport-jwt'
// import PassportGoogle from 'passport-google-oauth'
import crypto from 'crypto'

import User, { IUser } from '../models/user'
import EmailValidationToken from '../models/token'
import Tribe, { ITribeRole, MemberStatus } from '../models/tribe'
import mongoose from 'mongoose'

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJwt.Strategy
const ExtractJWT = passportJwt.ExtractJwt
// const GoogleStrategy = PassportGoogle.OAuth2Strategy

passport.serializeUser<IUser, string>((user, done) => {
  done(null, user._id)
})

passport.deserializeUser<IUser, string>((id, done) => {
  User.findById(id, null, null, (err, user) => {
      done(err, user ? user : undefined);
  });
})

// Login Strategy
passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) =>  {
  await User.findOne({ email: email })
  .then(user => {
    if (!user) {
      console.log('no user found')
      return done(null, false, { message: 'No User Found' })
    } else {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;

        if (!isMatch)
          return done(null, false, { message: "Invalid email or password" })

        return done(null, user)
      })
    }
  })
  .catch(err => {
    return done(err, false, { message: err });
  })
}))

// Signup strategy
passport.use('signup', new LocalStrategy({ usernameField: "email", passReqToCallback: true }, async (req, email, password, done) => {
  // Check if a user has an account already with the email or username sent

  try {
    const user = await User.findOne({ 'email': email })
    
    if (user) {
      console.log('found a user')
      return done(null, false, { message: "User found with that email already" })
    }

    console.log(req)
    const newTribe = new Tribe({
      name: `${req.body.name}s Tribe`,
      description: 'This is your home tribe.',
    })

    const adminRole: ITribeRole = {
      name: 'admin',
      color: '#000000',
      defaultRole: false,
      status: MemberStatus.Admin,
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
    }

    const memberRole: ITribeRole = {
      name: 'Member',
      color: '#000000',
      defaultRole: true,
      status: MemberStatus.Member,
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
    }

    newTribe.roles.push(adminRole)
    newTribe.roles.push(memberRole)

    const newUser = new User({
      name: req.body.name,
      email,
      password,
    })

    newUser.tribes.push(newTribe.id)
    newUser.save()

    newTribe.members.push({
      _id: new mongoose.Types.ObjectId(newUser._id),
      status: MemberStatus.Owner,
      aggreedToRules: false,
      memberSince: new Date().toISOString(),
    })
    newTribe.save()
    
    const token = new EmailValidationToken({
      _userId: newUser._id,
      token: crypto.randomBytes(16).toString('hex'),
    })

    token.save()

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
    //   to: newUser.email,
    //   subject: 'Account Verification Token',
    //   text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/auth\/email\/confirm\/' + token.token + '.\n'
    // }

    // transporter.sendMail(mailOptions, function (err) {
    //   if (err) {
    //     return done(err.message, user)
    //   }
    // })

    return done(null, newUser)
  } catch (err) {
    console.log(err)
    return done(err, false, { message: err as string });
  }
}))

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID as string,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//   callbackURL: 'http://localhost:5000/auth/google/callback',
// }, async (accessToke, refreshToken, profile, done) => {

//   await User.findOne({ googleId: profile.id })
//   .then(user => {
//     return done(null, profile)
//   })
//   .catch(error => done(error))
// }))

passport.use(new JWTStrategy({
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
  try {
    done(null, token.user)
  } catch (error) {
    console.log('error')
    done(error)
  }
}))

export default passport
