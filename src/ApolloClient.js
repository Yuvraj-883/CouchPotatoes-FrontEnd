import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://couch-potatoes-backend-smoky.vercel.app/graphql", // Your GraphQL API URL
  cache: new InMemoryCache(),
});

export default client;
