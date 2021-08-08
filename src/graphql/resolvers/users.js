
import uniqueID from 'uniqid';
import { User } from '../../models/user.model.js';

const UserResolvers = {
  Query: {
    getUser: async (_, __, { user }) => {
      try {
        if (!user) throw new Error('Unauthenticated');

        let users = await User.findOne({
          username: user.username,
        });

        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    login: async (_, args) => {
      const { email, password } = args;
      let errors = {};

      try {
        if (email.trim() === '') errors.email = 'email must not be empty';
        if (password === '') errors.password = 'password must not be empty';

        if (Object.keys(errors).length > 0) {
          throw new Error('bad input', { errors });
        }

        const user = await User.findByCredentials(email, password);
        if (!user) {
          errors.email = 'user not found';
          throw new Error('user not found', { errors });
        }

        const _ = await user.jsonwebtoken();
        return user;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password } = args;
      let errors = {};

      try {
        // Validate input data
        if (email.trim() === '') errors.email = 'email must not be empty';
        if (username.trim() === '')
          errors.username = 'username must not be empty';
        if (password.trim() === '')
          errors.password = 'password must not be empty';

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        // Create user
        const userId = uniqueID();
        const user = new User({ username, email, password, userId });
        const _ = user.jsonwebtoken();
        const newUser = await user.save();
        // Return user
        return newUser;
      } catch (err) {
        console.log(err);
        throw new Error('Bad input', { errors });
      }
    },
  },
};

export default UserResolvers;
