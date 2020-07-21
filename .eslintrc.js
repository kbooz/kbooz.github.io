module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
      "react-app",
      "plugin:@typescript-eslint/recommended",
      "prettier/@typescript-eslint",
      "plugin:prettier/recommended"
    ],
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: "module"
    },
    globals: {
      __PATH_PREFIX__: true,
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": [0]
    }
  };