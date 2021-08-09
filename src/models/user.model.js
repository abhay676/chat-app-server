import mongoose from 'mongoose';
import { genSalt, compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Config } from '../config/config.js';

const userSchema = mongoose.Schema({
  userId: { type: String, trim: true, unique: true, required: true },
  email: { type: String, trim: true, unique: true, required: true },
  username: { type: String, trim: true, unique: true, required: true },
  password: { type: String, trim: true, required: true },
  salt: { type: String, trim: true },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  activeToken: { type: String, trim: true, default: null },
  createdAt: { type: Date, default: new Date() },
});

//
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);
    user.salt = salt;
  }
  next();
});

userSchema.methods.jsonwebtoken = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id.toString(), email: user.email, username: user.username },
    Config.JWT_SECRET
  );
  user.tokens = user.tokens.concat({ token });
  user.activeToken = token;
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(`${email} not exists`);
  }

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    throw new Error(`email/password not correct`);
  }

  return user;
};

export const User = mongoose.model('users', userSchema);
