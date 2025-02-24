const path = require("path");

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  output: "standalone",
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
  serverRuntimeConfig: {
    PUBLIC_PATH: __dirname + '/public',
  },
  basePath: '/admin',
};
