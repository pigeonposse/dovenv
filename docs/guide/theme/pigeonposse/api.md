# `@dovenv/theme-pigeonposse` - Api documentation

## Functions

### bandaTheme()

```ts
function bandaTheme(opts?: Config): Config
```

Banda theme configuration for `dovenv`.

This function takes an optional object with keys matching the plugin names
and values that are the respective plugin's configuration objects.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `Config` | Optional configuration options. |

#### Returns

`Config`

The `dovenv` configuration object.

#### Example

```ts
import { bandaTheme } from '@dovenv/theme-banda'

export default bandaTheme( {
  lint: { commitlint: { gitmoji: true } },
  docs: {
      input: 'README.md',
      output: 'build/README.md',
  },
} )
```

***

### mergeConfig()

```ts
function mergeConfig(...config: (Config | Config[])[]): Config
```

Merges multiple `theme-pigeonposse` configuration objects into a single configuration.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`config` | ([`Config`](#config) \| [`Config`](#config)[])[] |

#### Returns

[`Config`](#config)

***

### pigeonposseTheme()

```ts
function pigeonposseTheme(params?: Config): Config
```

The `PigeonPosse` theme for Dovenv.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | [`Config`](#config) | The configuration for the theme. |

#### Returns

`Config`

The merged configuration.

This theme is a fork of the Banda theme with some changes to make it more suitable for the PigeonPosse monorepo.
It includes the same basic configuration as Banda, but adds some additional features and changes some of the defaults.

***

### pigeonposseWebPlugin()

```ts
function pigeonposseWebPlugin(params?: WebConfig): Config
```

Plugin for set the pigeonposse web configuration.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | [`WebConfig`](#webconfig) | Optional parameters for the plugin. |

#### Returns

`Config`

- A Dovenv configuration with a "transform" command for the `.pigeonposse.yml` file.

#### Example

```ts
import { defineConfig } from '@dovenv/core'
import { pigeonposseWebPlugin } from '@dovenv/theme-pigeonposse'

export default defineConfig( pigeonposseWebPlugin() )
```

## Type Aliases

### Config

```ts
type Config: BandaConfig & {
  web: WebConfig;
};
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `web`? | [`WebConfig`](#webconfig) |

***

### WebConfig

```ts
type WebConfig: {
  customValues: Record<string, unknown>;
  input: string;
  values: Record<string, unknown> | false;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `customValues`? | `Record`\<`string`, `unknown`\> | Merge with general values |
| `input`? | `string` | **Default** `'.pigeonposse.yml'` |
| `values`? | `Record`\<`string`, `unknown`\> \| `false` | override values. set to `false` to disable default values |

## References

### default

Renames and re-exports [pigeonposseTheme](#pigeonpossetheme)

## Namespaces

- [convert](namespaces/convert.md)
- [docs](namespaces/docs.md)
- [examples](namespaces/examples.md)
- [lint](namespaces/lint/index.md)
- [repo](namespaces/repo.md)
- [templates](namespaces/templates.md)
- [todo](namespaces/todo.md)
- [workspace](namespaces/workspace.md)
