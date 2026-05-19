//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config"
import simpleImportSort from "eslint-plugin-simple-import-sort"
// import importPlugin from "eslint-plugin-import"

export default [
  ...tanstackConfig,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"], // side effects
            ["^node:"], // node built-ins
            ["^\\w", "^@\\w"], // external packages (react, @tanstack/...)
            ["^@/"], // internal @/ alias
            ["^#/components", "^#/ui"], // UI layer
            ["^#/hooks", "^#/lib", "^#/utils"], // shared logic
            ["^#/features/[^/]+$"], // feature from the index
            ["^#/"], // internal #/ subpath
            ["^\\."], // relative (should rarely appear)
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "import/no-duplicates": "error",
      // Enforce #/ over relative for internal files
      "import/no-relative-packages": "error",
    },
  },
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message: "Use @/ or #/ instead of relative imports.",
            },
            // {
            //   regex: "^#/features/[^/]+/.+",
            //   message:
            //     "Import from the feature index instead: e.g. #/features/post",
            // },
          ],
        },
      ],
      "import/no-cycle": "off",
      "import/order": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
    },
  },
  {
    ignores: ["eslint.config.js", "prettier.config.js", "drizzle/**/*"],
  },
]
