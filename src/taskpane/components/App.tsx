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

// Function to create Apollo Client based on API key
function createClient(apiKey: string) {
    const httpLink = createHttpLink({
        uri: "https://se-staging.ee.ethz.ch/graphql",
    });

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
    const inputRef = React.useRef<HTMLInputElement>(null);
    const storedKey = localStorage.getItem("x_api_key") || "";
    const [client, setClient] = React.useState(() => createClient(storedKey));

    const handleSaveClick = () => {
        const value = inputRef.current?.value || "";
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
                        defaultValue={storedKey}
                        placeholder="Enter your Endoc API key..."
                        ref={inputRef}
                    />
                    <button onClick={handleSaveClick}>Save</button>
                </div>
                <DocumentSearch />
            </div>
        </ApolloProvider>
    );
};

export default App;


