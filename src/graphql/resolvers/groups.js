import { Group } from '../../models/group.model.js';

const groupResolvers = {
  Query: {
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
};

export default groupResolvers;
