import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import { insertText } from "../taskpane";
import DocumentSearch from "./DocumentSearch";
import { ApolloClient, InMemoryCache, gql, ApolloProvider, useQuery, useLazyQuery } from "@apollo/client";

const useStyles = makeStyles({
    root: {
        minHeight: "100vh",
        padding: "20px",
    }
});


const client = new ApolloClient({
    uri: "https://localhost:3001/proxy",
    cache: new InMemoryCache({
        addTypename: false
    }),
});


const App = () => {

    const styles = useStyles();

    return (
        <ApolloProvider client={client}>
            <div className={styles.root}>
                <DocumentSearch />
            </div>
        </ApolloProvider>
    );
};

export default App;

