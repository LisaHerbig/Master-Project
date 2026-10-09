// app.json stays the source of truth. Only the web demo build (WEB_DEMO=1, see
// scripts/build-web-demo.js) adjusts the web settings; native builds get app.json unchanged.
module.exports = ({ config }) => {
  if (process.env.WEB_DEMO !== '1') return config;

  return {
    ...config,
    web: {
      ...config.web,
      // "static" pre-renders in Node, where expo-secure-store is unavailable
      output: 'single',
    },
    experiments: {
      ...config.experiments,
      baseUrl: process.env.WEB_DEMO_BASE_URL ?? '/Master-Project/demo/app',
    },
  };
};
