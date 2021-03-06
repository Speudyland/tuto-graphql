import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

import { executableSchema } from './data/schema';

const GRAPHQL_IP = 'localhost';
const GRAPHQL_PORT = 8080;
const GRAPHQL_PATH = '/graphql';
const SUBSCRIPTIONS_PATH = '/subscriptions';
const app = express();


// as we have still no data, we use fixture with mock
// addMockFunctionsToSchema({
//  schema: executableSchema,
//  mocks: Mocks,
//  preserveResolvers: true,
// });

// 'context' must be an oject and cannot be undefined when using connectors
app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: executableSchema,
  context: {}, // at least an empty object
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: GRAPHQL_PATH,
  subscriptionsEndpoint: `ws://${GRAPHQL_IP}:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`,
}));

const graphQLServer = createServer(app);

graphQLServer.listen(GRAPHQL_PORT, () => {
  console.log(`graphQL Server is running like the white rabbit on http://${GRAPHQL_IP}:${GRAPHQL_PORT}${GRAPHQL_PATH}`);
  console.log(`graphQL Subscription is running like the black rabbit on http://${GRAPHQL_IP}:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`);
});

// eslint-disable-next-line no-unused-vars
const subscriptionServer = SubscriptionServer.create({
  schema: executableSchema,
  execute,
  subscribe,
}, {
  server: graphQLServer,
  path: SUBSCRIPTIONS_PATH,
});
