// Libraries
import * as React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { toast } from "react-toastify";

// Local
import "../taskpane.css";
import Panel from "./Panel";
import Onboarding from "./Onboarding";

/**
 * Decide endpoint by the actual origin at runtime.
 * If we're running from https://localhost:<port>, use the local proxy.
 * Otherwise (prod build hosted on your domain), use the prod GraphQL.
 */
const isLocalDev =
  typeof window !== "undefined" && /^https:\/\/localhost:\d+$/i.test(window.location.origin);

const GRAPHQL_URL = isLocalDev
  ? "https://localhost:3001/proxy"
  : "https://endoc.ethz.ch/graphql";

/** Very loud console logger for link chain (dev only) */
const debugLink = new ApolloLink((operation, forward) => {
  try {
    console.info(
      "[Endoc/Apollo] Request:",
      JSON.stringify({
        url: GRAPHQL_URL,
        operationName: operation.operationName,
        hasApiKey: !!operation.getContext()?.headers?.["x-api-key"],
      })
    );
  } catch {
    // no-op
  }
  const t0 = (typeof performance !== "undefined" && performance.now()) || Date.now();
  return forward(operation).map((response) => {
    const t1 = (typeof performance !== "undefined" && performance.now()) || Date.now();
    try {
      console.info(
        "[Endoc/Apollo] Response:",
        JSON.stringify({
          operationName: operation.operationName,
          durationMs: Math.round(t1 - t0),
          hasErrors: !!(response as any)?.errors?.length,
        })
      );
    } catch {
      // no-op
    }
    return response;
  });
});

function createClient(apiKey: string) {
  const httpLink = createHttpLink({ uri: GRAPHQL_URL, fetchOptions: { mode: "cors" } });

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      "x-api-key": apiKey || "",
    },
  }));

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors?.length) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
            locations
          )}, Path: ${path}`
        );
      });
      toast.error(`GraphQL error: ${graphQLErrors[0].message}`, {
        icon: <span role="img" aria-label="error">❌</span>,
      });
    }
    if (networkError) {
      console.error("[Network error]:", networkError);
      const msg =
        (networkError as any)?.message ||
        (networkError as any)?.name ||
        "Unknown network error";
      toast.error(`Network error: ${msg}`, {
        icon: <span role="img" aria-label="warning">⚠️</span>,
      });
    }
  });

  const link = from([debugLink, errorLink, authLink, httpLink]);

  return new ApolloClient({
    link,
    cache: new InMemoryCache({ addTypename: false }),
    defaultOptions: {
      query: { fetchPolicy: "network-only", errorPolicy: "all" },
      watchQuery: { fetchPolicy: "network-only", errorPolicy: "all" },
      mutate: { errorPolicy: "all" },
    },
  });
}

const App = () => {
  // Persistent API key
  const storedKey = (typeof window !== "undefined" && localStorage.getItem("x_api_key")) || "";
  const [apiKey, setApiKey] = React.useState(storedKey);
  const [client, setClient] = React.useState(() => createClient(storedKey));

  // Onboarding flag
  const [hasSeenOnboarding, setHasSeenOnboarding] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("seen_onboarding") === "true";
  });

  // Health check (optional)
  React.useEffect(() => {
    console.info("[Endoc] Runtime origin:", window.location.origin);
    console.info("[Endoc] Using GraphQL URL:", GRAPHQL_URL);
    console.info("[Endoc] API key present:", !!apiKey);

    const ping = async () => {
      try {
        const res = await fetch(GRAPHQL_URL, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": apiKey || "",
          },
          body: JSON.stringify({ query: "query { __typename }" }),
        });
        const text = await res.text();
        console.info("[Endoc] Health check status:", res.status);
        console.info("[Endoc] Health check body:", text);
      } catch (err: any) {
        console.error("[Endoc] Health check error:", err);
      }
    };
    if (apiKey) ping();
  }, [apiKey]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    setClient(createClient(newApiKey));
    if (typeof window !== "undefined") {
      localStorage.setItem("x_api_key", newApiKey);
    }
  };

  // When user finishes onboarding
  const handleOnboardingDone = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("seen_onboarding", "true");
    }
    setHasSeenOnboarding(true);
    // We deliberately do NOT open any modal here to avoid loops.
    // Users can open Settings from the gear any time.
  };

  return (
    <ApolloProvider client={client}>
      <div className="root">
        {!hasSeenOnboarding ? (
          <Onboarding onGetStarted={handleOnboardingDone} />
        ) : (
          <Panel apiKey={apiKey} handleApiKeyChange={handleApiKeyChange} />
        )}
      </div>
    </ApolloProvider>
  );
};

export default App;