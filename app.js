const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP; //exports a valid middleware function
const { buildSchema } = require('graphql');

const app = express();

const events = []; // global var. dev option only for now as first step. later will be a db here

app.use(bodyParser.json());
app.use('/graphql',
  graphqlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float! 
        date: String!
      }
      
      input EventInput {
        title: String!
        description: String!
        price: Float! 
        date: String!
      }


      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event 

      }
  
      schema {
        query: RootQuery
        mutation: RootMutation
      }
  `),
    rootValue: {
      events: () => {
        return  events;
      },

      //this has the resolver functions
      createEvent: (args) => {
        const event = { 
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date
        };
        events.push(event);
        return event;
      }
    },
    graphiql: true,
  })
);

app.get('/', (req, res, next) => {
  res.send('Hello!  Server Test! ');
});

app.listen(3000, () => console.log('App is listening on port 3000'));

