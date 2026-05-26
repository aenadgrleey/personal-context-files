import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["pi-extensions/**/*.ts"],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// Formatting is handled by Biome — disable style-only rules
			"@typescript-eslint/indent": "off",
			"@typescript-eslint/quotes": "off",
			"@typescript-eslint/semi": "off",
			"@typescript-eslint/comma-dangle": "off",

			// Keep semantic rules
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
			],
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{ prefer: "type-imports" },
			],
			"@typescript-eslint/no-non-null-assertion": "warn",
		},
	},
	{
		ignores: ["node_modules/", ".pi/", "dist/"],
	},
);
