const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP; //exports a valid middleware function
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());
app.use('/graphql',
  graphqlHttp({
    schema: buildSchema(`
      type RootQuery {
        events: [String!]!
      }

      type RootMutation {
        createEvent(name: String!): String!
      }
  
      schema {
        query: RootQuery
        mutation: RootMutation
      }
  `),
    rootValue: {
      events: () => {
        return ['Sailing', 'Coding', 'Biking', 'Hot-Yoga'];
      },

      //this has the resolver functions
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;

      }
    },
    graphiql: true,
  })
);

app.get('/', (req, res, next) => {
  res.send('Hello!  Server Test! ');
});

app.listen(3000, () => console.log('App is listening on port 3000'));

