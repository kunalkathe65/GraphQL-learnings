const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
const PORT = process.env.PORT || 4000;

const events = [];

//Defining Schema
const schema = buildSchema(`

    type Event{
        _id :ID!
        title : String!
        description : String!
        price : Float!
        date : String!
    }

    input EventInput{
        title : String!
        description : String!
        price : Float!
        date : String!
    }

    type RootQuery{
        events : [Event!]!
    }

    type RootMutation{
        createEvent(eventInput: EventInput) : Event!
    }

    schema {
        query : RootQuery ,
        mutation : RootMutation
    }
`);

//Defining Resolvers (each & every query, mutations, fragment, subscriptions etc must have a resolver with exact name)
const root = {

    //resolver for event "query"
    events() {   
        return events;
    },

    //resolver for createEvent "mutation"
    createEvent(args) {   
        const newEvent = {
            _id : 1,
            title : args.eventInput.title,
            description : args.eventInput.description,
            price : +args.eventInput.price, //'+' => to convert everything to number
            date : args.eventInput.date
        }
        events.push(newEvent);
        return newEvent;
    }
}


app.use('/graphql',graphqlHTTP({
    schema : schema,
    rootValue : root,
    graphiql : true
}));

app.listen(PORT,() => {
    console.log(`Server started on port ${PORT}`);
})