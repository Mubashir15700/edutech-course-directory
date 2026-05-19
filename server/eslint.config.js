import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
    js.configs.recommended,

    ...tseslint.configs.recommended,

    prettier,

    {
        files: ["**/*.ts", "**/*.tsx"],

        languageOptions: {
            parser: tseslint.parser,
        },

        rules: {
            "no-console": "warn",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "warn",
        },

        ignores: ["**/node_modules/**", "**/dist/**"],
    },
];
