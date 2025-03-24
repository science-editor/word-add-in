import * as React from "react";
import "../taskpane.css";
import DocumentSearch from "./DocumentSearch";
import { ApolloClient, InMemoryCache, ApolloProvider} from "@apollo/client";


const client = new ApolloClient({
    uri: "https://localhost:3001/proxy",
    cache: new InMemoryCache({
        addTypename: false
    }),
})


const App = () => {

    return (
        <ApolloProvider client={client}>
            <div className='root'>
                <DocumentSearch />
            </div>
        </ApolloProvider>
    );
};

export default App;

