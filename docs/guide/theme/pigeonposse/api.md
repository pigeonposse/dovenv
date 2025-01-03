# `@dovenv/theme-pigeonposse` - API documentation

## Classes

### Predocs

#### Extends

- `PluginCore`\<`PredocsConfig`\>

#### Constructors

##### new Predocs()

```ts
new Predocs(opts: undefined, config?: Config): Predocs
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `undefined` |
| `config`? | `Config` |

###### Returns

[`Predocs`](#predocs)

###### Overrides

`PluginCore<PredocsConfig>.constructor`

#### Methods

##### getMarkdownInfo()

```ts
getMarkdownInfo(): Promise<{
  config: string;
  lib: string;
  more: string;
  plugin: string;
  theme: string;
}>
```

###### Returns

`Promise`\<\{
  `config`: `string`;
  `lib`: `string`;
  `more`: `string`;
  `plugin`: `string`;
  `theme`: `string`;
 \}\>

| Name | Type |
| ------ | ------ |
| `config` | `string` |
| `lib` | `string` |
| `more` | `string` |
| `plugin` | `string` |
| `theme` | `string` |

##### run()

```ts
run(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### setContributorsFile()

```ts
setContributorsFile(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### setGuideIndexFile()

```ts
setGuideIndexFile(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### setGuideSectionIndexFile()

```ts
setGuideSectionIndexFile(config: {
  none: ObjectValues<{
     config: 'config';
     lib: 'lib';
     plugin: 'plugin';
     theme: 'theme';
    }>;
}): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `object` |
| `config.none`? | `ObjectValues`\<\{ `config`: `'config'`; `lib`: `'lib'`; `plugin`: `'plugin'`; `theme`: `'theme'`; \}\> |

###### Returns

`Promise`\<`void`\>

##### setIndexFile()

```ts
setIndexFile(config?: {
  content: string;
  creationTemplate: boolean;
  custom: Record<string, unknown>;
  noAction: boolean;
  noFeatures: boolean;
}): Promise<void>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config`? | `object` | - |
| `config.content`? | `string` | - |
| `config.creationTemplate`? | `boolean` | Change template to `creation` template |
| `config.custom`? | `Record`\<`string`, `unknown`\> | - |
| `config.noAction`? | `boolean` | - |
| `config.noFeatures`? | `boolean` | - |

###### Returns

`Promise`\<`void`\>

##### setPkgFiles()

```ts
setPkgFiles(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type | Default value | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `config` | `undefined` \| `Config` | `undefined` | The dovenv configuration. | - | `PluginCore.config` |
| `opts` | `undefined` | `undefined` | Configuration options. | - | `PluginCore.opts` |
| `projectName` | `any` | `undefined` | - | - | - |
| `title` | `string` | `'Predocs'` | - | `PluginCore.title` | - |

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

### getSidebar()

```ts
function getSidebar(dovenvConfig: Config, opts?: SidebarConfig): Promise<SidebarItem[]>
```

Generates a sidebar configuration for @dovenv/docs plugin.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `dovenvConfig` | `Config` | The Dovenv configuration. |
| `opts`? | `SidebarConfig` | The options. |

#### Returns

`Promise`\<`SidebarItem`[]\>

The sidebar configuration.

***

### getWorkspaceConfig()

```ts
function getWorkspaceConfig(opts?: WsOpts & {
  core: WsOpts;
  packages: WsOpts;
}): Promise<ConstsConfig>
```

Get the workspace configuration.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `WsOpts` & \{ `core`: `WsOpts`; `packages`: `WsOpts`; \} | The options for getting the workspace configuration. |

#### Returns

`Promise`\<`ConstsConfig`\>

The workspace configuration.

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

### pigeonposseMonorepoTheme()

```ts
function pigeonposseMonorepoTheme(params?: Config): Config
```

The `pigeonposseMonorepoTheme` for Dovenv.
This theme is a fork of the Banda theme with some changes to make it more suitable for the PigeonPosse monorepo.
It includes the same basic configuration as Banda, but adds some additional features and changes some of the defaults.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | [`Config`](#config) | The configuration for the theme. |

#### Returns

`Config`

The merged configuration.

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

***

### pkgBadges()

```ts
function pkgBadges(options: PkgBadgesOptions): string
```

Generates markdown links for package-related badges.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `PkgBadgesOptions` | The package badge options. |

#### Returns

`string`

The generated markdown links.

***

### socialBadges()

```ts
function socialBadges(data: SocialLinks): undefined | string
```

Generates markdown links for social badges.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `SocialLinks` | The social links data. |

#### Returns

`undefined` \| `string`

The generated markdown links or undefined if no links are provided.

## Type Aliases

### Config

```ts
type Config: BandaConfig & {
  web: WebConfig;
 } & {
  core: ConstsConfig;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `web`? | [`WebConfig`](#webconfig) | Configuration for the pigeonposse web File data |

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `core`? | `ConstsConfig` | Set the pigeonposse theme constants and information **Example** `import { getWorkspaceConfig } from '@dovenv/theme-pigeonposse' const core = await getWorkspaceConfig({metaURL : import.meta.url, path : '../../../../'} )` |

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

## Variables

### predocsCommand

```ts
const predocsCommand: Config;
```

## Namespaces

- [convert](namespaces/convert.md)
- [docs](namespaces/docs.md)
- [examples](namespaces/examples.md)
- [lint](namespaces/lint/index.md)
- [partial](namespaces/partial.md)
- [repo](namespaces/repo.md)
- [template](namespaces/template.md)
- [templates](namespaces/templates.md)
- [todo](namespaces/todo.md)
- [workspace](namespaces/workspace.md)
