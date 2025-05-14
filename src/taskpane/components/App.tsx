import * as React from "react";
import "../taskpane.css";
import DocumentSearch from "./DocumentSearch";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

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

    return new ApolloClient({
        link: authLink.concat(httpLink),
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
                <h3>Endoc API Key</h3>
                <div style={{ display: "flex", gap: "8px" }}>
                    <input
                        className="input"
                        type="text"
                        value={apiKey}
                        placeholder="Enter your Endoc API key..."
                        onChange={handleApiKeyChange}
                    />
                </div>
                <DocumentSearch />
            </div>
        </ApolloProvider>
    );
};

export default App;
