# @dovenv/media

## 🔑 Installation

::: code-group

```bash [npm]
npm install @dovenv/media
```

```bash [pnpm]
pnpm install @dovenv/media
```

```bash [yarn]
yarn add @dovenv/media
```

```bash [bun]
bun add @dovenv/media
```

```bash [deno]
deno add @dovenv/media
```

:::


## Features

- __Image Minification__: Optimize your images
- __Terminal GIF Creation__: Create GIFs from your terminal
- __Code Image Generation__: Turn your code into beautiful images
- __QR Code Generation__: Generate QR codes for your projects

## 📈 Usage

### Minify

```js twoslash
import { defineConfig } from '@dovenv/core'
import mnediaPlugin from '@dovenv/media'

export default defineConfig( mnediaPlugin( {
  min : {
  'example-images' : {
   input  : [ 'media/*.png'],
   output : './public',
   opts   : { png: true },
  },
  'example-gifs' : {
   input  : [ 'media/*.gif' ],
   output : './public',
   opts   : { gif: { optimizationLevel: 3 } },
  },
 },
}))
```

```bash
dovenv media min
```

### Generate Code Images

```js twoslash
import { defineConfig } from '@dovenv/core'
import mnediaPlugin from '@dovenv/media'

export default defineConfig( mnediaPlugin( {
 codeimage : {
  'example-path' : {
   input : 'src/types.ts',
   flags : [ '--interactive' ],
  },
  'example-code-text' : {
   input : `import { defineConfig } from '@dovenv/core'\nexport default defineConfig({/** config */})`,
   flags : [ '--interactive' ],
  },
  'example-url' : {
   input : `https://raw.githubusercontent.com/pigeonposse/binarium/refs/heads/main/.dovenv/main.js`,
   flags : [ '--interactive' ],
  },
 },
}))
```

```bash
dovenv media codeimage
```

### Generate Terminal gifs

```js twoslash
import { defineConfig } from '@dovenv/core'
import mnediaPlugin from '@dovenv/media'

export default defineConfig( mnediaPlugin( {
 termgif : { test : {
  configPath : 'terminal-config.yml',
  output     : './public',
 } },
}))
```

```bash
dovenv media termgif
```

### Generate QR codes

```bash
dovenv media qr -i 'https://dovenv.pigeonposse.com'
```

## More

- 💡 [Examples](examples.md)
- 📖 [API Docs](api.md)
- 📦 [NPM](https://www.npmjs.com/package/@dovenv/media)
