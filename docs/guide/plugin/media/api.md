# `@dovenv/media` - Api documentation

## Functions

### mediaPlugin()

```ts
function mediaPlugin(conf?: Config): Config
```

A plugin for dovenv to handle media tasks.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `conf`? | `Config` | The configuration object. |

#### Returns

`Config`

- The plugin.

#### Example

```ts
import { defineConfig } from '@dovenv/core'
import { mediaPlugin } from '@dovenv/media'
export default defineConfig(
    mediaPlugin( {
        codeimage: {
            example1: {
                type: 'code',
                input: 'examples/recourses/main.js',
                output: 'build/code',
            },
            example2: {
                type: 'code',
                input: 'examples/recourses/main.ts',
                output: 'build/ts',
            },
        },
        min: {
            example1: {
                type: 'min',
                input: 'examples/recourses/main.png',
                output: 'build/images',
            },
        },
    } ),
)
```

## References

### default

Renames and re-exports [mediaPlugin](#mediaplugin)
