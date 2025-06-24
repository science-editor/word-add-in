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
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import TutorialWindow from "./TutotrialWindow";
import SettingsIcon from '@mui/icons-material/Settings';

const GRAPHQL_URL =
    process.env.NODE_ENV === "production"
        ? "https://endoc.ethz.ch/graphql"
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
    const endocURL = "https://endoc.ethz.ch/";
    const [showTutorial, setShowTutorial] = React.useState(false);

    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setApiKey(value);
        localStorage.setItem("x_api_key", value);
        setClient(createClient(value));
        console.log("API key saved and client updated");
    };

    const openTutorialWindow = () => {
        setShowTutorial(true)
    };

    const closeTutorialWindow = () => {
        setShowTutorial(false);
    }

    return (
        <ApolloProvider client={client}>
            <div className="root">
                <TutorialWindow
                    showTutorial={showTutorial}
                    closeTutorialWindow={closeTutorialWindow}
                    apiKey={apiKey}
                    handleApiKeyChange={handleApiKeyChange}
                />

                    <div style={{ display: "flex", justifyContent: "flex-end"}}>
                        <IconButton
                            aria-label="Endoc API Key help"
                            size="medium"
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%"
                            }}
                            onClick={openTutorialWindow}
                        >
                            <SettingsIcon fontSize="inherit" />
                        </IconButton>
                    </div>

                <DocumentSearch />
            </div>
        </ApolloProvider>
    );
};

export default App;
