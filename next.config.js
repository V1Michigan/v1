module.exports = {
  target: 'serverless',
  reactStrictMode: true,
  webpack(config, { isServer }) {
    // Don't load react-pdf code on the server, since react-pdf requires e.g. canvas
    // https://github.com/wojtekmaj/react-pdf/issues/799
    // https://github.com/mozilla/pdf.js/issues/13373
    if (isServer) {
      config.resolve.alias.canvas = false;
    }
    return config;
  },
};
