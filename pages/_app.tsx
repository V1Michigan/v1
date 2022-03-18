import "typeface-source-sans-pro";
import "typeface-inter";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";
import { SupabaseProvider } from "../contexts/SupabaseContext";

import "../styles/index.css";

export const HOSTNAME =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_HOSTNAME || "https://v1michigan.com";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(
    // "V1 website" property automatically tracks some events, e.g. page views
    () => ReactGA.initialize(process.env.NEXT_PUBLIC_GA_ID || ""),
    []
  );
  return (
    <SupabaseProvider>
      <Component {...pageProps} />
    </SupabaseProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default MyApp;
