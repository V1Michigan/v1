import "typeface-source-sans-pro";
import "typeface-inter";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";
import { QueryClient, QueryClientProvider } from "react-query";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { SupabaseProvider } from "../contexts/SupabaseContext";
import "../styles/index.css";

export const HOSTNAME =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_HOSTNAME || "https://v1michigan.com";

// Initialize PostHog on the client side only
if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    loaded: (_posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
    capture_pageview: true, // Make sure pageview capturing is enabled
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  useEffect(() => {
    // Test PostHog connection
    if (typeof window !== "undefined") {
      posthog.capture("app_loaded");
    }

    // Existing GA code
    if (process.env.NODE_ENV !== "development") {
      ReactGA.initialize(process.env.NEXT_PUBLIC_GA_ID || "");
    }
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider>
          <Component {...pageProps} />
        </SupabaseProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default MyApp;
