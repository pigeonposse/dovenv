# @dovenv/ai

A plugin designed for developers seeking to integrate a local AI assistant into their development workflow. With `@dovenv/ai`, you can configure and run AI-powered chat environments tailored to your project's needs. This plugin is part of the dovenv ecosystem, which aims to simplify and enhance the developer experience.

---

## Features

- **Local AI Assistant**: Configure and run an AI assistant with customizable chat options.
- **Seamless Integration**: Works effortlessly with the `dovenv` ecosystem.
- **Extensible Configurations**: Define and manage AI chat settings for various use cases.

---

## Installation

{{partial.installation}}

## CLI

Usage with:

```bash
dovenv ai
```

### Options

```bash
  -k, --key  Select a Local AI assistant config key
```

## Config

```js twoslash
import { defineConfig } from '@dovenv/core'
import aiPluglin from '@dovenv/ai'

export default defineConfig(
 aiPluglin( { chat : { chatID : { /* Your chat configuration */ } } } )
)
```

## Examples

```js twoslash
import { defineConfig } from '@dovenv/core'
import aiPluglin from '@dovenv/ai'
export default defineConfig( aiPluglin( {
chat : { env : {
 input  : [ './src/*' ],
 theme  : 'custom',
 system : 'You are a code expert of this workspace.',
}}} ))
```

Run it

```bash
dovenv ai -k env
```
