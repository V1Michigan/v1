import "typeface-source-sans-pro";
import "typeface-inter";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";
import { SupabaseProvider } from "../contexts/SupabaseContext";

import "../styles/index.css";
import { QueryClient, QueryClientProvider } from "react-query";

export const HOSTNAME =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_HOSTNAME || "https://v1michigan.com";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  useEffect(
    // "V1 website" property automatically tracks some events, e.g. page views
    () => {
      if (process.env.NODE_ENV !== "development") {
        ReactGA.initialize(process.env.NEXT_PUBLIC_GA_ID || "");
      }
    },
    []
  );
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <Component {...pageProps} />
      </SupabaseProvider>
    </QueryClientProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default MyApp;
