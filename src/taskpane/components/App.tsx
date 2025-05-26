import * as React from "react";
import "../taskpane.css";
import DocumentSearch from "./DocumentSearch";
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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const GRAPHQL_URL =
    process.env.NODE_ENV === "production"
        ? "https://se-staging.ee.ethz.ch/graphql"
        : "https://localhost:3001/proxy";

// Function to create Apollo Client based on API key
function createClient(apiKey: string) {
    const httpLink = createHttpLink({ uri: GRAPHQL_URL });

    const authLink = setContext((_, { headers }) => ({
        headers: {
            ...headers,
            "x-api-key": apiKey,
        },
    }));

    // ** Error Link **
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

    // Compose links: errorLink first so it sees everything
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
        const value = e.target.value;
        setApiKey(value);
        localStorage.setItem("x_api_key", value);
        setClient(createClient(value));
        console.log("API key saved and client updated");
    };

    return (
        <ApolloProvider client={client}>
            <div className="root">
                <div className="settings-container">
                    <div>
                        <p className="title">Endoc API Key</p>
                        <HelpOutlineIcon />
                    </div>
                    <input
                        type="text"
                        value={apiKey}
                        placeholder="Enter your Endoc API key..."
                        onChange={handleApiKeyChange}
                    />
                    <hr className="divider" />
                </div>
                <DocumentSearch />
            </div>
        </ApolloProvider>
    );
};

export default App;
