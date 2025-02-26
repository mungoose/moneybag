import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // Target JavaScript and TypeScript files
    plugins: {
      prettier: prettierPlugin, // Add the Prettier plugin
    },
    rules: {
      ...prettierConfig.rules, // Disable ESLint rules that conflict with Prettier
      "prettier/prettier": "error", // Treat Prettier issues as ESLint errors
    },
  },
];

export default eslintConfig;
