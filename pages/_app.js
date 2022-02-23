import "typeface-source-sans-pro";
import "typeface-inter";
import PropTypes from "prop-types";

import "../styles/index.css";

function MyApp({ Component, pageProps }) {
  return <Component { ...pageProps } />;
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default MyApp;
