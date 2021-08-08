import mongoose from 'mongoose';
import { DoEncrypt } from '../utils/encrypt.js';

const messageSchema = mongoose.Schema({
  messageId: { type: String, trim: true, unique: true, required: true },
  message: { type: String, trim: true, required: true },
  from: { type: String, trim: true, required: true },
  groupId: { type: String, trim: true, required: true },
  createdAt: { type: String, default: new Date().toString() },
});

messageSchema.pre('save', async function (next) {
  const grp = this;
  // encrypt message
  grp.message = DoEncrypt(grp.message);
  next();
});

messageSchema.methods.toJSON = function () {
  const msg = this;
  const msgObject = msg.toObject();
  delete msgObject._id;
  return msgObject;
};

export const Message = mongoose.model('messages', messageSchema);
