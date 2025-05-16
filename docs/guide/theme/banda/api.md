# `@dovenv/theme-banda` - API documentation

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
| `opts`? | [`Config`](#config) | Optional configuration options. |

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

Merges multiple `banda-theme` configuration objects into a single configuration.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`config` | ([`Config`](#config) \| [`Config`](#config)[])[] |

#### Returns

[`Config`](#config)

## Type Aliases

### Config

```ts
type Config: {
  convert: Config;
  docs: Config;
  examples: Config;
  lint: Config;
  repo: Parameters<typeof default>[0];
  templates: Config;
  todo: Config;
  workspace: Config;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `convert`? | [`Config`](namespaces/convert.md#config) | Convert configuration. **See** - https://dovenv.pigeonposse.com/guide/plugin/convert - https://www.npmjs.com/package/@dovenv/convert |
| `docs`? | [`Config`](namespaces/docs.md#config) | Documentation configuration. **See** - https://dovenv.pigeonposse.com/guide/plugin/docs - https://www.npmjs.com/package/@dovenv/docs |
| `examples`? | [`Config`](namespaces/examples.md#config) | Examples configuration. **See** - https://dovenv.pigeonposse.com/guide/plugin/examples - https://www.npmjs.com/package/@dovenv/examples |
| `lint`? | [`Config`](namespaces/lint.md#config) | Lint configuration. **See** - https://dovenv.pigeonposse.com/guide/plugin/lint - https://www.npmjs.com/package/@dovenv/lint |
| `repo`? | `Parameters`\<*typeof* [`default`](namespaces/repo.md#default)\>\[`0`\] | Repository configuration. **See** - https://dovenv.pigeonposse.com/guide/plugin/repo - https://www.npmjs.com/package/@dovenv/repo |
| `templates`? | [`Config`](namespaces/templates.md#config) | Templates configuration. **See** - https://dovenv.pigeonposse.com/guide/plugin/templates - https://www.npmjs.com/package/@dovenv/templates |
| `todo`? | [`Config`](namespaces/todo.md#config) | To-Do configuration. **See** - https://dovenv.pigeonposse.com/guide/plugin/todo - https://www.npmjs.com/package/@dovenv/todo |
| `workspace`? | [`Config`](namespaces/workspace.md#config) | Workspace configuration. **See** - https://dovenv.pigeonposse.com/guide/plugin/workspace - https://www.npmjs.com/package/@dovenv/workspace |

## References

### default

Renames and re-exports [bandaTheme](#bandatheme)

## Namespaces

- [convert](namespaces/convert.md)
- [docs](namespaces/docs.md)
- [examples](namespaces/examples.md)
- [lint](namespaces/lint.md)
- [repo](namespaces/repo.md)
- [templates](namespaces/templates.md)
- [todo](namespaces/todo.md)
- [workspace](namespaces/workspace.md)
