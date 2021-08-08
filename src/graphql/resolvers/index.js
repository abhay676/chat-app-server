import userResolvers from './users.js';
import messageResolvers from './messages.js';
import groupsResolvers from './messages.js';
export default {
  User: {},
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query,
    ...groupsResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation,
  },
  Subscription: {
    ...messageResolvers.Subscription,
  },
};
