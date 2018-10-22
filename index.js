const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

// Some fake data
const books = [
  {
    id: 0,
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
    inventory: 0,
  },
  {
    id: 1,
    title: 'Jurassic Park',
    author: 'Michael Crichton',
    inventory: 0,
  },
];

// The GraphQL schema in string form
const typeDefs = `
  type Query {
    books: [Book]
    book(id: Int!): Book
  }

  type Book { id: Int!, title: String, author: String, inventory: Int }

  type Mutation {
    updateTitle (
      id: Int!
      title: String!
    ): Book
    updateAuthor (
      id: Int!
      author: String!
    ): Book
    increaseInventory (
      id: Int!
    ): Book
  }
`;

// The resolvers
const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => books.find(book => book.id === id)
  },
  Mutation: {
    updateTitle: (_, { id, title }) => {
      const book = books.find(book => book.id === id);
      if (!book) {
        throw new Error(`Couldn't find book with id ${id}`);
      }

      book.title = title;
      return book;

    },
    updateAuthor: (_, { id, author }) => {
        const book = books.find(book => book.id === id);
        if (!book) {
          throw new Error(`Couldn't find book with id ${id}`);
        }

        book.author = author;
        return book;
    },
    increaseInventory: (_, { id }) => {
      const book = books.find(book => book.id === id);
      if (!book) {
        throw new Error(`Couldn't find book with id ${id}`);
      }
      book.inventory += 1;
      return book;
    },
  }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.get('/rest', (req, res) => {
  console.log('!!!--------REST req hit ------!!!!');
  res.send({wtf: 123})
});

// Start the server
app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!');
});
