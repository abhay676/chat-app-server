import mongoose from 'mongoose';

const groupSchema = mongoose.Schema({
  groupId: { type: String, trim: true, unique: true, required: true },
  name: { type: String, trim: true, unique: true, required: true },
  slug: { type: String, trim: true },
  createdAt: { type: Date, default: new Date() },
});
export const Group = mongoose.model('groups', groupSchema);
