# @dovenv/lint

## 🔑 Installation

::: code-group

```bash [npm]
npm install @dovenv/lint
```

```bash [pnpm]
pnpm install @dovenv/lint
```

```bash [yarn]
yarn add @dovenv/lint
```

```bash [bun]
bun add @dovenv/lint
```

```bash [deno]
deno add @dovenv/lint
```

:::

## Features

- [x] **ESLint**
- [x] **Stylelint**
- [x] **Commitlint**
- [x] **Lint-staged**

## 📈 Usage

### eslint

Run ESLint to analyze and fix JavaScript/TypeScript code.

```bash
dovenv eslint
```

```bash
dovenv eslint --fix
```

You can pass eslint options to the plugin.

```js twoslash
import { defineConfig } from '@dovenv/core'
import lintPlugin from '@dovenv/lint'

export default defineConfig( lintPlugin( {
 eslint     : { /** options */ },
} ) )
```

### stylelint

Run Stylelint to analyze and fix CSS/SCSS files.

```bash
dovenv stylelint
```

You can pass stylelint options to the plugin.

```js twoslash
import { defineConfig } from '@dovenv/core'
import lintPlugin from '@dovenv/lint'

export default defineConfig( lintPlugin( {
 stylelint  : { configFile: 'stylelint.config.js' },
} ) )
```

### commitlint

Run Commitlint to enforce commit message conventions.

```bash
dovenv commitlint
```

You can pass commitlint options to the plugin.

```js twoslash
import { defineConfig } from '@dovenv/core'
import lintPlugin from '@dovenv/lint'

export default defineConfig( lintPlugin( {
 commitlint : { gitmoji: true },
} ) )
```

### staged

Lint files staged for commit using the configured linters.

```bash
dovenv lint staged
```

You can pass staged options to the plugin.

```js twoslash
import { defineConfig } from '@dovenv/core'
import lintPlugin from '@dovenv/lint'

export default defineConfig( lintPlugin( {
 staged     : { '**/*.{js,ts,jsx,tsx}': 'eslint' },
} ) )
```

## More

- 💡 [Examples](examples.md)
- 📖 [API Docs](api.md)
- 📦 [NPM](https://www.npmjs.com/package/@dovenv/lint)
