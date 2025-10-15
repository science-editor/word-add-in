/* eslint-disable no-undef */

const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");

// load .env if present (harmless if missing)
dotenv.config();

// single source of truth for the dev port
const DEV_PORT =
  Number(process.env.PORT) ||
  Number(process.env.npm_package_config_dev_server_port) ||
  7000;

const urlDev = `https://localhost:${DEV_PORT}/`;
const urlProd = "https://endoc.ethz.ch/";

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";

  return {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      vendor: ["react", "react-dom", "core-js", "@fluentui/react-components", "@fluentui/react-icons"],
      taskpane: ["./src/taskpane/index.tsx", "./src/taskpane/taskpane.html"],
      commands: "./src/commands/commands.ts",
    },
    output: {
      clean: true,
      publicPath: "/", // CRITICAL so /taskpane.html resolves
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"],
    },
    module: {
      rules: [
        { test: /\.ts$/, exclude: /node_modules/, use: { loader: "babel-loader" } },
        { test: /\.tsx?$/, exclude: /node_modules/, use: ["ts-loader"] },
        { test: /\.html$/, exclude: /node_modules/, use: "html-loader" },
        {
          test: /\.(png|jpg|jpeg|ttf|woff|woff2|gif|ico)$/,
          type: "asset/resource",
          generator: { filename: "assets/[name][ext][query]" },
        },
        { test: /\.css$/i, use: ["style-loader", "css-loader"] },
      ],
    },
    plugins: [
      // Taskpane page — include ONLY taskpane chunks
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "vendor", "taskpane"],
      }),
      // Commands page — include ONLY commands chunk
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["polyfill", "vendor", "commands"],
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "assets/*", to: "assets/[name][ext][query]" },
          {
            from: "manifest*.xml",
            to: "[name]" + "[ext]",
            transform(content) {
              if (dev) return content;
              return content.toString().replace(new RegExp(urlDev, "g"), urlProd);
            },
          },
        ],
      }),
      new webpack.ProvidePlugin({ Promise: ["es6-promise", "Promise"] }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || (dev ? "development" : "production")),
        "process.env.ENDOC_API_BASE": JSON.stringify(process.env.ENDOC_API_BASE || "https://endoc.ethz.ch"),
        "process.env.ENDOC_GRAPHQL_URL": JSON.stringify(
          process.env.ENDOC_GRAPHQL_URL ||
            `${(process.env.ENDOC_API_BASE || "https://endoc.ethz.ch").replace(/\/+$/, "")}/graphql`
        ),
      }),
    ],
    devServer: {
      hot: true,
      headers: { "Access-Control-Allow-Origin": "*" },
      server: {
        type: "https",
        options: env.WEBPACK_BUILD || options.https !== undefined ? options.https : await getHttpsOptions(),
      },
      port: DEV_PORT,
    },
  };
};