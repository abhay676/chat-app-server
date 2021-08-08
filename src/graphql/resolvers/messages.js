import uniqueID from 'uniqid';
import { User } from '../../models/user.model.js';
import { Message } from '../../models/message.model.js';
import { Group } from '../../models/group.model.js';
import { pubsub } from '../../utils/JWTmiddleware.js';

const messageResolver = {
  Query: {
    getMessages: async (_, { groupId }, { user }) => {
      try {
        if (!user) throw new Error('Unauthenticated');

        const messages = await Message.find({
          groupId,
        }).sort({ createdAt: -1 });

        return messages;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    getGroups: async (_, __, { user }) => {
      try {
        if (!user) throw new Error('Unauthenticated');

        const grp = await Group.find({});
        return grp;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (_, { groupId, content }, { user }) => {
      try {
        if (!user) throw new Error('Unauthenticated');

        const recipient = await User.findOne({ email: user.email });

        if (!recipient) {
          throw new Error('User not found');
        }

        if (content.trim() === '') {
          throw new Error('Message is empty');
        }
        const msgId = uniqueID();
        const msgObj = {
          messageId: msgId,
          from: user.username,
          groupId,
          message: content,
        };
        const message = await Message.create(msgObj);

        pubsub.publish('NEW_MESSAGE', { newMessage: message });

        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator('NEW_MESSAGE'),
    },
  },
};

export default messageResolver;
