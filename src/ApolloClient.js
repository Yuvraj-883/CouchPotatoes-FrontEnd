import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql", // Your GraphQL API URL
  cache: new InMemoryCache(),
});

export default client;
