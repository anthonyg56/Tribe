import mongoose, { Schema, Document } from "mongoose"
import bcrypt from 'bcrypt'

const SALT_WORK_FACTOR = 10

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdOn: string;
  avatar: {
    cloudinary_id: string;
    url: string;
  };
  password: string;
  tribes: [mongoose.Types.ObjectId];
  invites: [mongoose.Types.ObjectId];
  comparePassword: (candidatePassword: string, cb: any) => void;
}

const UserSchema = new Schema<IUser>({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tribe'
  }],
  invites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invite'
  }]
})

UserSchema.pre('save', function(next) {
  var user = this as IUser

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
  })
})

UserSchema.methods.comparePassword = function(candidatePassword: any, cb: any) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
}

const User = mongoose.model<IUser>('User', UserSchema)

export default User
