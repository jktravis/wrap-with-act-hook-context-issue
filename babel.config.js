// babel.config.js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 2,
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    ["@babel/plugin-transform-typescript", { allowNamespaces: true }],
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    "babel-plugin-emotion",
  ],
};
