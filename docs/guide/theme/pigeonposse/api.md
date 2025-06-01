# `@dovenv/theme-pigeonposse` - API documentation

## Classes

### Predocs

#### Accessors

##### partial

###### Get Signature

```ts
get partial(): {
  creation: string;
  creationGroup: string;
  footer: string;
  installation: string;
  installationGroup: string;
}
```

Object containing partials

###### Returns

```ts
{
  creation: string;
  creationGroup: string;
  footer: string;
  installation: string;
  installationGroup: string;
}
```

- Object containing partials strings

| Name | Type | Description |
| ------ | ------ | ------ |
| `creation` | `string` | Returns the creation instructions for the library. **required const**: libPkg. |
| `creationGroup` | `string` | Returns the creation instructions for the library. **required const**: libPkg. |
| `footer` | `string` | Returns the footer for the documentation. **required const**: pkg, socialBadges, mark, contributors. |
| `installation` | `string` | Returns the installation instructions for the library. **required const**: libPkg. |
| `installationGroup` | `string` | Returns the installation instructions for the library. **required const**: libPkg. |

##### projectName

###### Get Signature

```ts
get projectName(): string
```

###### Returns

`string`

##### template

###### Get Signature

```ts
get template(): {
  docsContributors: string;
  docsIndex: string;
  docsIndexWithCreate: string;
  readmePkg: string;
}
```

Object containing templates

###### Returns

```ts
{
  docsContributors: string;
  docsIndex: string;
  docsIndexWithCreate: string;
  readmePkg: string;
}
```

- Object containing templates strings

| Name | Type | Description |
| ------ | ------ | ------ |
| `docsContributors` | `string` | Returns a contributors index template for a `dovenv` docs page. **required const**: templateMark. |
| `docsIndex` | `string` | Returns a index template for a `dovenv` docs page. **required const**: templateMark, docsIndex. **required partial**: installationGroup. |
| `docsIndexWithCreate` | `string` | Returns a index template for a `dovenv` docs page with project creation instructions. **required const**: templateMark, docsIndex. **required partial**: installationGroup. |
| `readmePkg` | `string` | Returns the readme template for a package. **required const**: title, pkg, socialBadges, pkgBadges, toc, banner. **required partial**: installation, toc, content. |

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

Retrieves and constructs the Markdown information for the packages.

- If the Markdown information is already available, it returns the cached result.
- Otherwise, it fetches the public package data and groups them by type.
- For each group, it constructs a structured Markdown content that includes
titles, descriptions, and links for each package.

###### Returns

`Promise`\<`MarkdownInfo`\>

A promise that resolves to an object containing
                                 the Markdown content for each package type.

##### getWorkspacePublicPackagesData()

```ts
getWorkspacePublicPackagesData(): Promise<PkgData>
```

Returns the public packages data for the workspace.

###### Returns

`Promise`\<[`PkgData`](#pkgdata)\>

An array of public package data objects.

##### run()

```ts
run(opts?: RunOpts): Promise<void>
```

Create package docs simultaneously.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `RunOpts` | Optional options. |

###### Returns

`Promise`\<`void`\>

- Resolves when all docs are created.

##### setContributorsFile()

```ts
setContributorsFile(opts?: ContributorsFileOpts): Promise<void>
```

Generates and writes a contributors file using the specified template.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `ContributorsFileOpts` | Optional configuration for generating the contributors file. Can include additional properties to pass to the template. |

###### Returns

`Promise`\<`void`\>

##### setGuideIndexFile()

```ts
setGuideIndexFile(opts?: GuideIndexFileOpts): Promise<void>
```

Sets the guide index file in the documentation directory.

This method checks if a workspace index file exists within the core directory.
If it exists, it uses the templates to generate the guide index file and writes
it to the documentation guide directory. If the file does not exist, an info
message is logged.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `GuideIndexFileOpts` | Optional configuration for template properties. |

###### Returns

`Promise`\<`void`\>

##### setGuideSectionIndexFile()

```ts
setGuideSectionIndexFile(opts?: {
  none: string[] | PkgType[];
}): Promise<void>
```

Writes the guide section index files.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `object` | The options object. |
| `opts.none`? | `string`[] \| [`PkgType`](#pkgtype)[] | - |

###### Returns

`Promise`\<`void`\>

An empty fulfilled promise.

##### setIndexFile()

```ts
setIndexFile(opts?: {
  content: string;
  creationTemplate: boolean;
  custom: Record<string, unknown>;
  noAction: boolean;
  noFeatures: boolean;
}): Promise<void>
```

Writes the index file to the documentation root directory.

This file is the entry point for users to access the documentation.
It is a generated file that is rewritten every time the documentation is built.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `object` | The options object. |
| `opts.content`? | `string` | Add content after frontmatter |
| `opts.creationTemplate`? | `boolean` | Change template to `creation` template |
| `opts.custom`? | `Record`\<`string`, `unknown`\> | Add custom content to index doc page. **See** https://vitepress.dev/reference/default-theme-home-page |
| `opts.noAction`? | `boolean` | Remove default action |
| `opts.noFeatures`? | `boolean` | Remove default features |

###### Returns

`Promise`\<`void`\>

An empty fulfilled promise.

##### setPackageApiFile()

```ts
setPackageApiFile(config: PackageFileConfig, opts?: false | {
  props: {
     input: string | string[];
     opts: {
        hooks: {
           after: () => ... | ...;
           before: () => ... | ...;
          };
        name: string;
        packageJsonPath: string;
        transform: (content: string) => Promise<string>;
        tsconfigPath: string;
        typedoc: Partial<Omit<TypeDocOptions, "plugin" | "tsconfig" | "entryPoints" | "out">>;
        typedocMarkdown: Partial<PluginOptions>;
       };
     output: string;
    };
}): Promise<void>
```

Generates and writes the API documentation file for a package.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | `PackageFileConfig` | Configuration object containing public package data and markdown info. |
| `opts`? | `false` \| \{ `props`: \{ `input`: `string` \| `string`[]; `opts`: \{ `hooks`: \{ `after`: () => ... \| ...; `before`: () => ... \| ...; \}; `name`: `string`; `packageJsonPath`: `string`; `transform`: (`content`: `string`) => `Promise`\<`string`\>; `tsconfigPath`: `string`; `typedoc`: `Partial`\<`Omit`\<`TypeDocOptions`, `"plugin"` \| `"tsconfig"` \| `"entryPoints"` \| `"out"`\>\>; `typedocMarkdown`: `Partial`\<`PluginOptions`\>; \}; `output`: `string`; \}; \} | Optional configuration properties for the API file generation. If set to `false`, the function exits without processing. |

###### Returns

`Promise`\<`void`\>

###### Throws

Throws an error if the API documentation generation fails.

##### setPackageExamplesFile()

```ts
setPackageExamplesFile(config: PackageFileConfig, opts?: false | {
  props: Config;
}): Promise<void>
```

Generates a file with examples.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | `PackageFileConfig` | The public package configuration. |
| `opts`? | `false` \| \{ `props`: [`Config`](namespaces/examples.md#config); \} | The options to pass to the examples plugin. |

###### Returns

`Promise`\<`void`\>

###### Example

```ts
const predocs = new Predocs()
const publicPkgs = await predocs.getWorkspacePublicPackageData( )
const info = await predocs.getMarkdownInfo()
for ( const publicPkg of publicPkgs ) {
  await predocs.setPackageExamplesFile( { publicPkg, info } )
}
```

##### setPackageFiles()

```ts
setPackageFiles(opts?: PackageFileOpts): Promise<void>
```

Set the files for each package in the workspace.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `PackageFileOpts` | Options. |

###### Returns

`Promise`\<`void`\>

##### setPackageIndexFile()

```ts
setPackageIndexFile(config: PackageFileConfig, opts?: false | {
  props: Config;
}): Promise<void>
```

Sets the index file for the package in the documentation directory.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | `PackageFileConfig` | Configuration for the package file. |
| `opts`? | `false` \| \{ `props`: [`Config`](namespaces/templates.md#config); \} | Optional configuration for the package file. |

###### Returns

`Promise`\<`void`\>

###### Example

```ts
const predocs = new Predocs()
const publicPkgs = await predocs.getWorkspacePublicPackageData( )
const info = await predocs.getMarkdownInfo()

for ( const publicPkg of publicPkgs ) {
  await predocs.setPackageIndexFile( { publicPkg, info } )
}
```

##### setPackageJSONFile()

```ts
setPackageJSONFile(config: PackageFileConfig, opts?: false | {
  props: {
     devEngines: {
        cpu: undefined | {
           name: string;
           onFail: "warn" | "error" | "ignore";
           version: string;
          };
        libc: undefined | {
           name: string;
           onFail: "warn" | "error" | "ignore";
           version: string;
          };
        os: undefined | {
           name: string;
           onFail: "warn" | "error" | "ignore";
           version: string;
          };
        packageManager: undefined | {
           name: string;
           onFail: "warn" | "error" | "ignore";
           version: string;
          };
        runtime: undefined | {
           name: string;
           onFail: "warn" | "error" | "ignore";
           version: string;
          };
       };
    };
}): Promise<void>
```

Writes the package.json file for the documentation package.

This method sets the `homepage`, `repository`, `license`, `funding`, and `bugs` fields
in the package.json file. It also copies the `author` field from the workspace package.json
if it exists. If the PackageFileOpts.packages option is set to `false`, the method does nothing.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | `PackageFileConfig` | Configuration for the package file. |
| `opts`? | `false` \| \{ `props`: \{ `devEngines`: \{ `cpu`: `undefined` \| \{ `name`: `string`; `onFail`: `"warn"` \| `"error"` \| `"ignore"`; `version`: `string`; \}; `libc`: `undefined` \| \{ `name`: `string`; `onFail`: `"warn"` \| `"error"` \| `"ignore"`; `version`: `string`; \}; `os`: `undefined` \| \{ `name`: `string`; `onFail`: `"warn"` \| `"error"` \| `"ignore"`; `version`: `string`; \}; `packageManager`: `undefined` \| \{ `name`: `string`; `onFail`: `"warn"` \| `"error"` \| `"ignore"`; `version`: `string`; \}; `runtime`: `undefined` \| \{ `name`: `string`; `onFail`: `"warn"` \| `"error"` \| `"ignore"`; `version`: `string`; \}; \}; \}; \} | Optional configuration for the package file. |

###### Returns

`Promise`\<`void`\>

##### setPackageReadmeFile()

```ts
setPackageReadmeFile(config: PackageFileConfig, opts?: false | {
  markdownLinks: (pkg: {
     data: {
        devEngines: {
           cpu: undefined | {
              name: string;
              onFail: ... | ... | ... | ...;
              version: ... | ...;
             };
           libc: undefined | {
              name: string;
              onFail: ... | ... | ... | ...;
              version: ... | ...;
             };
           os: undefined | {
              name: string;
              onFail: ... | ... | ... | ...;
              version: ... | ...;
             };
           packageManager: undefined | {
              name: string;
              onFail: ... | ... | ... | ...;
              version: ... | ...;
             };
           runtime: undefined | {
              name: string;
              onFail: ... | ... | ... | ...;
              version: ... | ...;
             };
          };
       };
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
    }) => MdLink[];
  props: Config;
}): Promise<void>
```

Generates and writes the README file for a package.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | `PackageFileConfig` | Configuration object containing public package data and markdown info. |
| `opts`? | `false` \| \{ `markdownLinks`: (`pkg`: \{ `data`: \{ `devEngines`: \{ `cpu`: `undefined` \| \{ `name`: `string`; `onFail`: ... \| ... \| ... \| ...; `version`: ... \| ...; \}; `libc`: `undefined` \| \{ `name`: `string`; `onFail`: ... \| ... \| ... \| ...; `version`: ... \| ...; \}; `os`: `undefined` \| \{ `name`: `string`; `onFail`: ... \| ... \| ... \| ...; `version`: ... \| ...; \}; `packageManager`: `undefined` \| \{ `name`: `string`; `onFail`: ... \| ... \| ... \| ...; `version`: ... \| ...; \}; `runtime`: `undefined` \| \{ `name`: `string`; `onFail`: ... \| ... \| ... \| ...; `version`: ... \| ...; \}; \}; \}; `docs`: \{ `apiFile`: `string`; `dir`: `string`; `examplesFile`: `string`; `indexFile`: `string`; `urlPath`: \{ `api`: `string`; `examples`: `string`; `index`: `string`; \}; \}; `emojiId`: `string`; `emojiType`: `string`; `id`: `string`; `name`: `string`; `package`: \{ `dir`: `string`; `docsFile`: `string`; `examplesConfigFile`: `string`; `isTs`: `boolean`; `packageJsonFile`: `string`; `readmeFile`: `string`; `relativeDir`: `string`; `srcFile`: `string`; `tsconfigFile`: `string`; \}; `pathID`: `string`; `repoURL`: `string`; `title`: `string`; `type`: [`PkgType`](#pkgtype); \}) => `MdLink`[]; `props`: [`Config`](namespaces/templates.md#config); \} | Optional configuration properties for the README generation. If set to `false`, the function exits without processing. |

###### Returns

`Promise`\<`void`\>

###### Throws

Throws an error if the README generation fails.

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `opts` | `undefined` \| [`PredocsConfig`](#predocsconfig) | `undefined` | General Configuration options |
| `title` | `string` | `'predocs'` | The name of the project |

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
function predocsPlugin(opts?: PredocsConfig | (data: Predocs) => Promise<void>): Config
```

Create package docs simultaneously.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | [`PredocsConfig`](#predocsconfig) \| (`data`: [`Predocs`](#predocs)) => `Promise`\<`void`\> | Optional opts to pass to [Predocs](#predocs). |

#### Returns

`Config`

- Dovenv plugin config.

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
  predocs: NonNullable<Parameters<typeof predocsPlugin>[0]> | false;
};
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `predocs`? | `NonNullable`\<`Parameters`\<*typeof* [`predocsPlugin`](#predocsplugin)\>\[`0`\]\> \| `false` |

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

### EMOJI

```ts
const EMOJI: {
  about: '✨';
  ai: '🤖';
  api: '📖';
  blog: '📝';
  bug: '🐛';
  cli: '🔢';
  config: '⚙️';
  convert: '🔄';
  core: '🌞';
  create: '🚀';
  dev: '👨‍💻';
  development: '👨‍💻';
  docker: '🐳';
  docs: '📚';
  donate: '❤️';
  example: '💡';
  examples: '💡';
  extension: '🧩';
  extensions: '🧩';
  feat: '🌟';
  feats: '🌟';
  feature: '🌟';
  features: '🌟';
  getStarted: "🏁";
  index: '📍';
  info: 'ℹ️';
  installation: '🔑';
  library: '📚';
  license: '📜';
  lint: '🧹';
  media: '🎥';
  more: '➕';
  package: '📦';
  plugin: '🔌';
  preset: '💾';
  presets: '💾';
  repo: '🗃️';
  repos: '🗃️';
  repository: '🗃️';
  server: '🗄️';
  setup: '🎉';
  template: '🖼️';
  templates: '🖼️';
  test: '✅';
  theme: '🎨';
  todo: '✅';
  toolkit: '🧰';
  tutorial: '🎓';
  tutorials: '🎓';
  usage: '📄';
  utils: '⚒️';
  web: '🌐';
  workspace: '📂';
};
```

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `about` | `"✨"` | '✨' |
| `ai` | `"🤖"` | '🤖' |
| `api` | `"📖"` | '📖' |
| `blog` | `"📝"` | '📝' |
| `bug` | `"🐛"` | '🐛' |
| `cli` | `"🔢"` | '🔢' |
| `config` | `"⚙️"` | '⚙️' |
| `convert` | `"🔄"` | '🔄' |
| `core` | `"🌞"` | '🌞' |
| `create` | `"🚀"` | '🚀' |
| `dev` | `"👨‍💻"` | '👨‍💻' |
| `development` | `"👨‍💻"` | '👨‍💻' |
| `docker` | `"🐳"` | '🐳' |
| `docs` | `"📚"` | '📚' |
| `donate` | `"❤️"` | '❤️' |
| `example` | `"💡"` | '💡' |
| `examples` | `"💡"` | '💡' |
| `extension` | `"🧩"` | '🧩' |
| `extensions` | `"🧩"` | '🧩' |
| `feat` | `"🌟"` | '🌟' |
| `feats` | `"🌟"` | '🌟' |
| `feature` | `"🌟"` | '🌟' |
| `features` | `"🌟"` | '🌟' |
| `getStarted` | `"🏁"` | - |
| `index` | `"📍"` | '📍' |
| `info` | `"ℹ️"` | 'ℹ️' |
| `installation` | `"🔑"` | '🔑' |
| `library` | `"📚"` | '📚' |
| `license` | `"📜"` | '📜' |
| `lint` | `"🧹"` | '🧹' |
| `media` | `"🎥"` | '🎥' |
| `more` | `"➕"` | '➕' |
| `package` | `"📦"` | '📦' |
| `plugin` | `"🔌"` | '🔌' |
| `preset` | `"💾"` | '💾' |
| `presets` | `"💾"` | '💾' |
| `repo` | `"🗃️"` | '🗃️' |
| `repos` | `"🗃️"` | '🗃️' |
| `repository` | `"🗃️"` | '🗃️' |
| `server` | `"🗄️"` | '🗄️' |
| `setup` | `"🎉"` | '🎉' |
| `template` | `"🖼️"` | '🖼️' |
| `templates` | `"🖼️"` | '🖼️' |
| `test` | `"✅"` | '✅' |
| `theme` | `"🎨"` | '🎨' |
| `todo` | `"✅"` | '✅' |
| `toolkit` | `"🧰"` | '🧰' |
| `tutorial` | `"🎓"` | '🎓' |
| `tutorials` | `"🎓"` | '🎓' |
| `usage` | `"📄"` | '📄' |
| `utils` | `"⚒️"` | '⚒️' |
| `web` | `"🌐"` | '🌐' |
| `workspace` | `"📂"` | '📂' |

***

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

***

### TYPE

```ts
const TYPE: {
  config: 'config';
  lib: 'library';
  plugin: 'plugin';
  preset: 'preset';
  theme: 'theme';
};
```

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `config` | `"config"` | 'config' |
| `lib` | `"library"` | 'library' |
| `plugin` | `"plugin"` | 'plugin' |
| `preset` | `"preset"` | 'preset' |
| `theme` | `"theme"` | 'theme' |

## Namespaces

- [convert](namespaces/convert.md)
- [docs](namespaces/docs.md)
- [examples](namespaces/examples.md)
- [lint](namespaces/lint.md)
- [repo](namespaces/repo.md)
- [templates](namespaces/templates.md)
- [todo](namespaces/todo.md)
- [workspace](namespaces/workspace.md)
