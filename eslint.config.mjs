import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.browser } },
    {
        rules: {
            "no-console": "warn",
            "no-unused-vars": "warn",
            "no-unused-expressions": "warn",
            "no-unreachable": "warn",
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
];
