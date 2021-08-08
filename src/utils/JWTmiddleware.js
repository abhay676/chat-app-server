import jwt from 'jsonwebtoken';
import { PubSub } from 'graphql-subscriptions';
import { Config } from '../config/config.js';
export const pubsub = new PubSub();
export default (context) => {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split('Bearer ')[1];
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split('Bearer ')[1];
  }

  if (token) {
    jwt.verify(token, Config.JWT_SECRET, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }
  context.pubsub = pubsub;
  return context;
};
