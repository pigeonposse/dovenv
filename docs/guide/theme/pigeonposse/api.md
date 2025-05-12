# `@dovenv/theme-pigeonposse` - API documentation

## Classes

### Predocs

#### Constructors

##### new Predocs()

```ts
new Predocs(__namedParameters: {
  opts: PredocsConfig;
  utils: CommandSuper;
 }): Predocs
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`PredocsConfig`](#predocsconfig) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`Predocs`](#predocs)

#### Methods

##### getMarkdownInfo()

```ts
getMarkdownInfo(): Promise<MarkdownInfo>
```

###### Returns

`Promise`\<`MarkdownInfo`\>

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
setGuideSectionIndexFile(config: undefined | {
  none: string[] | PkgType[];
}): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `undefined` \| \{ `none`: `string`[] \| [`PkgType`](#pkgtype)[]; \} |

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
| `config.content`? | `string` | Add content after frontmatter |
| `config.creationTemplate`? | `boolean` | Change template to `creation` template |
| `config.custom`? | `Record`\<`string`, `unknown`\> | Add custom content to index doc page. **See** https://vitepress.dev/reference/default-theme-home-page |
| `config.noAction`? | `boolean` | Remove default action |
| `config.noFeatures`? | `boolean` | Remove default features |

###### Returns

`Promise`\<`void`\>

##### setPkgFiles()

```ts
setPkgFiles(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `opts` | `undefined` \| [`PredocsConfig`](#predocsconfig) | `undefined` | - |
| `partial` | \{ `creation`: `string`; `creationGroup`: `string`; `footer`: `string`; `installation`: `string`; `installationGroup`: `string`; \} | `undefined` | - |
| `partial.creation` | `string` | `undefined` | Returns the creation instructions for the library. **required const**: libPkg. |
| `partial.creationGroup` | `string` | `undefined` | Returns the creation instructions for the library. **required const**: libPkg. |
| `partial.footer` | `string` | `undefined` | Returns the footer for the documentation. **required const**: pkg, socialBadges, mark, contributors. |
| `partial.installation` | `string` | `undefined` | Returns the installation instructions for the library. **required const**: libPkg. |
| `partial.installationGroup` | `string` | `undefined` | Returns the installation instructions for the library. **required const**: libPkg. |
| `projectName` | `any` | `undefined` | - |
| `template` | \{ `docsContributors`: `string`; `docsIndex`: `string`; `docsIndexWithCreate`: `string`; `readmePkg`: `string`; \} | `undefined` | - |
| `template.docsContributors` | `string` | `undefined` | Returns a contributors index template for a `dovenv` docs page. **required const**: templateMark. |
| `template.docsIndex` | `string` | `undefined` | Returns a index template for a `dovenv` docs page. **required const**: templateMark, docsIndex. **required partial**: installationGroup. |
| `template.docsIndexWithCreate` | `string` | `undefined` | Returns a index template for a `dovenv` docs page with project creation instructions. **required const**: templateMark, docsIndex. **required partial**: installationGroup. |
| `template.readmePkg` | `string` | `undefined` | Returns the readme template for a package. **required const**: title, pkg, socialBadges, pkgBadges, toc, banner. **required partial**: installation, toc, content. |
| `title` | `string` | `'predocs'` | - |

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
function getSidebar(__namedParameters: {
  opts: SidebarConfig;
  utils: CommandSuper;
}): Promise<SidebarItem[]>
```

Generates a sidebar configuration for @dovenv/docs plugin.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`SidebarConfig`](#sidebarconfig) |
| `__namedParameters.utils` | `CommandSuper` |

#### Returns

`Promise`\<`SidebarItem`[]\>

The sidebar configuration.

***

### getWorkspaceConfig()

```ts
function getWorkspaceConfig(opts?: WorkspaceParams): Promise<ConstsConfig>
```

Get the workspace configuration.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `WorkspaceParams` | The options for getting the workspace configuration. |

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
function pigeonposseMonorepoTheme(params?: MonorepoConfig): Config
```

The `pigeonposseMonorepoTheme` for Dovenv.
This theme is a fork of the Banda theme with some changes to make it more suitable for the PigeonPosse monorepo.
It includes the same basic configuration as Banda, but adds some additional features and changes some of the defaults.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | [`MonorepoConfig`](#monorepoconfig) | The configuration for the theme. |

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

### predocsPlugin()

```ts
function predocsPlugin(opts?: PredocsConfig): Config
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | [`PredocsConfig`](#predocsconfig) |

#### Returns

`Config`

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
  core: ConstsConfig;
  web: WebConfig;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `core`? | `ConstsConfig` | Set the pigeonposse theme constants and information. **Example** `import { getWorkspaceConfig } from '@dovenv/theme-pigeonposse' const core = await getWorkspaceConfig({metaURL : import.meta.url, path : '../../../../'} )` |
| `web`? | [`WebConfig`](#webconfig) | Configuration for the pigeonposse web File data |

***

### MonorepoConfig

```ts
type MonorepoConfig: Config & {
  predocs: PredocsConfig | false;
};
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `predocs`? | [`PredocsConfig`](#predocsconfig) \| `false` |

***

### PkgData

```ts
type PkgData: {
  data: {
     data: PackageJSON;
     docs: {
        apiFile: string;
        dir: string;
        examplesFile: string;
        indexFile: string;
        urlPath: {
           api: string;
           examples: string;
           index: string;
          };
       };
     emojiId: string;
     emojiType: string;
     id: string;
     name: string;
     package: {
        dir: string;
        docsFile: string;
        examplesConfigFile: string;
        isTs: boolean;
        packageJsonFile: string;
        readmeFile: string;
        relativeDir: string;
        srcFile: string;
        tsconfigFile: string;
       };
     pathID: string;
     repoURL: string;
     title: string;
     type: PkgType;
    }[];
  docsDir: string;
  docsGuideDir: string;
  docsPublicDir: string;
  name: string;
  packagesPath: string;
  url: string;
  urlGuidePath: string;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `data` | \{ `data`: `PackageJSON`; `docs`: \{ `apiFile`: `string`; `dir`: `string`; `examplesFile`: `string`; `indexFile`: `string`; `urlPath`: \{ `api`: `string`; `examples`: `string`; `index`: `string`; \}; \}; `emojiId`: `string`; `emojiType`: `string`; `id`: `string`; `name`: `string`; `package`: \{ `dir`: `string`; `docsFile`: `string`; `examplesConfigFile`: `string`; `isTs`: `boolean`; `packageJsonFile`: `string`; `readmeFile`: `string`; `relativeDir`: `string`; `srcFile`: `string`; `tsconfigFile`: `string`; \}; `pathID`: `string`; `repoURL`: `string`; `title`: `string`; `type`: [`PkgType`](#pkgtype); \}[] | - |
| `docsDir` | `string` | Absosulte local dir of documentation |
| `docsGuideDir` | `string` | Absosulte local dir of documentation guide |
| `docsPublicDir` | `string` | Absosulte local dir of documentation assets |
| `name` | `string` | - |
| `packagesPath` | `string` | - |
| `url` | `string` | - |
| `urlGuidePath` | `string` | - |

***

### PkgType

```ts
type PkgType: ObjectValues<typeof TYPE>;
```

***

### PredocsConfig

```ts
type PredocsConfig: {
  emoji: EmojiObject | false;
  guideSection: {
     none: PkgType[] | string[];
    };
  index: {
     content: string;
     creationTemplate: boolean;
     custom: Record<string, unknown>;
     noAction: boolean;
     noFeatures: boolean;
    };
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `emoji`? | `EmojiObject` \| `false` | Set emojis for your packages. **Example** `{ 	 * core: '🌞', 	 * create: false, 	 * }` |
| `guideSection`? | \{ `none`: [`PkgType`](#pkgtype)[] \| `string`[]; \} | Guide section options |
| `guideSection.none`? | [`PkgType`](#pkgtype)[] \| `string`[] | - |
| `index`? | \{ `content`: `string`; `creationTemplate`: `boolean`; `custom`: `Record`\<`string`, `unknown`\>; `noAction`: `boolean`; `noFeatures`: `boolean`; \} | Set index page options |
| `index.content`? | `string` | Add content after frontmatter |
| `index.creationTemplate`? | `boolean` | Change template to `creation` template |
| `index.custom`? | `Record`\<`string`, `unknown`\> | Add custom content to index doc page. **See** https://vitepress.dev/reference/default-theme-home-page |
| `index.noAction`? | `boolean` | Remove default action |
| `index.noFeatures`? | `boolean` | Remove default features |

***

### SidebarConfig

```ts
type SidebarConfig: {
  emojis: EmojiObject | false;
  onlyReference: boolean;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `emojis`? | `EmojiObject` \| `false` | Change, remove or add emojis to sidebar |
| `onlyReference`? | `boolean` | Get only sidebar reference. **Default** `false` |

***

### SidebarItems

```ts
type SidebarItems: ExtractSidebarArray<Sidebar>;
```

***

### WebConfig

```ts
type WebConfig: {
  customValues: Record<string, unknown>;
  input: string;
  values: Record<string, unknown> | false;
  version: string;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `customValues`? | `Record`\<`string`, `unknown`\> | Merge with general values |
| `input`? | `string` | **Default** `'.pigeonposse.yml'` |
| `values`? | `Record`\<`string`, `unknown`\> \| `false` | Override values. Set to `false` to disable default values |
| `version`? | `string` | Version of the web. **Default** `latest` |

## References

### default

Renames and re-exports [pigeonposseTheme](#pigeonpossetheme)

## Variables

### partial

```ts
const partial: {
  creation: string;
  creationGroup: string;
  footer: string;
  installation: string;
  installationGroup: string;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `creation` | `string` | Returns the creation instructions for the library. **required const**: libPkg. |
| `creationGroup` | `string` | Returns the creation instructions for the library. **required const**: libPkg. |
| `footer` | `string` | Returns the footer for the documentation. **required const**: pkg, socialBadges, mark, contributors. |
| `installation` | `string` | Returns the installation instructions for the library. **required const**: libPkg. |
| `installationGroup` | `string` | Returns the installation instructions for the library. **required const**: libPkg. |

***

### template

```ts
const template: {
  docsContributors: string;
  docsIndex: string;
  docsIndexWithCreate: string;
  readmePkg: string;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `docsContributors` | `string` | Returns a contributors index template for a `dovenv` docs page. **required const**: templateMark. |
| `docsIndex` | `string` | Returns a index template for a `dovenv` docs page. **required const**: templateMark, docsIndex. **required partial**: installationGroup. |
| `docsIndexWithCreate` | `string` | Returns a index template for a `dovenv` docs page with project creation instructions. **required const**: templateMark, docsIndex. **required partial**: installationGroup. |
| `readmePkg` | `string` | Returns the readme template for a package. **required const**: title, pkg, socialBadges, pkgBadges, toc, banner. **required partial**: installation, toc, content. |

## Namespaces

- [convert](namespaces/convert.md)
- [docs](namespaces/docs.md)
- [examples](namespaces/examples.md)
- [lint](namespaces/lint/index.md)
- [repo](namespaces/repo.md)
- [templates](namespaces/templates.md)
- [todo](namespaces/todo.md)
- [workspace](namespaces/workspace.md)
