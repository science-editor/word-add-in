// Libraries
import * as React from "react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
    from
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { toast } from "react-toastify";

// Local
import "../taskpane.css";
import Panel from "./Panel";


const GRAPHQL_URL =
    process.env.NODE_ENV === "production"
        ? "https://endoc.ethz.ch/graphql"
        : "https://localhost:3001/proxy";

function createClient(apiKey: string) {
    const httpLink = createHttpLink({ uri: GRAPHQL_URL });

    const authLink = setContext((_, { headers }) => ({
        headers: {
            ...headers,
            "x-api-key": apiKey,
        },
    }));

    const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
                console.error(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                );
                toast.error(`GraphQL error: ${message}`, {
                    icon: <span role="img" aria-label="error">❌</span>,
                });
            });
        }
        if (networkError) {
            console.error(`[Network error]: ${networkError}`);
            toast.error(`Network error: ${networkError.message}`, {
                icon: <span role="img" aria-label="warning">⚠️</span>,
            });
        }
    });

    const link = from([errorLink, authLink, httpLink]);

    return new ApolloClient({
        link,
        cache: new InMemoryCache({ addTypename: false }),
    });
}


const App = () => {
    const storedKey = localStorage.getItem("x_api_key") || "";
    const [apiKey, setApiKey] = React.useState(storedKey);
    const [client, setClient] = React.useState(() => createClient(storedKey));

    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newApiKey = e.target.value;

        setApiKey(newApiKey);
        setClient(createClient(newApiKey));
        localStorage.setItem("x_api_key", newApiKey);
    };


    return (
        <ApolloProvider client={client}>
            <div className="root">
                <Panel
                    apiKey={apiKey}
                    handleApiKeyChange={handleApiKeyChange}
                />
            </div>
        </ApolloProvider>
    );
};

export default App;
