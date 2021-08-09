import { createServer } from 'http';
import cors from 'cors';
import { execute, subscribe } from 'graphql';
import mongoose from 'mongoose';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import resolvers from './graphql/resolvers/index.js';
import typeDefs from './graphql/typeDef.js';
import { Config } from './config/config.js';
import authContext from './utils/JWTmiddleware.js';
(async function () {
  const app = express();

  app.use(cors());

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    context: authContext,
  });
  await server.start();
  server.applyMiddleware({ app });

  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  mongoose
    .connect(Config.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log('Connected to Database!');
    })
    .catch((err) => console.log(err));

  app.use((err, req, res, next) => {
    let errors = [],
      errObj = {};
    err.statusCode = err.statusCode || 500;
    const origin = req.originalUrl;
    errObj.message = err.message;
    errObj.value = err.value;
    errObj.location = err.location || 'APP_INTERNAL';
    errObj.origin = origin;
    errors.push(errObj);
    res.status(err.statusCode).json({
      status: false,
      errors,
    });
  });

  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
})();
