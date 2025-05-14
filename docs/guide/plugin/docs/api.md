# `@dovenv/docs` - API documentation

## Functions

### defineConfig()

```ts
function defineConfig(...config: (DocsConfig | DocsConfig[])[]): DocsConfig
```

Defines a configuration object for the dovenv documentation plugin.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`config` | ([`DocsConfig`](#docsconfig) \| [`DocsConfig`](#docsconfig)[])[] | The configuration object. |

#### Returns

[`DocsConfig`](#docsconfig)

The defined configuration object.

***

### docs()

```ts
function docs(args?: Omit<DocsParams, "utils">, utils?: {
  pkg: Record<string, unknown>;
  wsDir: string;
}): Promise<DocsCore>
```

Creates DOCUMENTATION instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args`? | `Omit`\<[`DocsParams`](#docsparams), `"utils"`\> | Optional arguments excluding 'utils'. |
| `utils`? | `object` | Optional utilities parameters. |
| `utils.pkg`? | `Record`\<`string`, `unknown`\> | Optional package.json content as an object. |
| `utils.wsDir`? | `string` | The workspace directory path. **Default** `process.cwd()` |

#### Returns

`Promise`\<`DocsCore`\>

A promise that resolves to an instance of DocsCore.

***

### docsPlugin()

```ts
function docsPlugin(config?: Config): Config
```

Define a `dovenv` configuration that creates a documentation site for your workspace.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config`? | [`Config`](#config) | The configuration object. |

#### Returns

`Config`

The dovenv configuration object.

***

### getPkgConfig()

```ts
function getPkgConfig(pkgData: {
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
}): Promise<DocsConfig>
```

Extracts and constructs documentation configuration from package JSON data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pkgData` | `object` | The package JSON data object. |
| `pkgData.devEngines`? | `object` | The devEngines field aids engineers working on a codebase to all be using the same tooling. **See** https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines |
| `pkgData.devEngines.cpu` | `undefined` \| \{ `name`: `string`; `onFail`: `"warn"` \| `"error"` \| `"ignore"`; `version`: `string`; \} | - |
| `pkgData.devEngines.libc` | `undefined` \| \{ `name`: `string`; `onFail`: `"warn"` \| `"error"` \| `"ignore"`; `version`: `string`; \} | - |
| `pkgData.devEngines.os` | `undefined` \| \{ `name`: `string`; `onFail`: `"warn"` \| `"error"` \| `"ignore"`; `version`: `string`; \} | - |
| `pkgData.devEngines.packageManager` | `undefined` \| \{ `name`: `string`; `onFail`: `"warn"` \| `"error"` \| `"ignore"`; `version`: `string`; \} | - |
| `pkgData.devEngines.runtime` | `undefined` \| \{ `name`: `string`; `onFail`: `"warn"` \| `"error"` \| `"ignore"`; `version`: `string`; \} | - |

#### Returns

`Promise`\<[`DocsConfig`](#docsconfig)\>

A promise that resolves to a `DocsConfig` object containing extracted configuration details like funding URL, bugs URL, license, homepage URL, description, name, version, and contributors.

## Type Aliases

### Config

```ts
type Config: DocsConfig | (utils: CommandUtils) => Response<DocsConfig>;
```

***

### DocsConfig

```ts
type DocsConfig: {
  autoSidebar: {
     about: boolean;
     contribute: boolean;
     intro: boolean;
     reference: boolean;
    };
  bugsURL: string | false;
  changelogURL: string | false;
  contributingURL: string | false;
  contributors: {
     actionText: string;
     avatar: string;
     desc: string;
     links: SocialLinks;
     name: string;
     org: string;
     orgLink: string;
     sponsor: string;
     title: string;
    }[];
  css: string;
  desc: string;
  docsPath: string;
  download: {
     groups: {};
     items: {};
    };
  experimental: {
     noTempDirOnBuild: boolean;
    };
  favicon: string;
  footer: {
     copy: {
        name: string;
        url: string;
       };
     links: {
        email: string;
        instagram: string;
        medium: string;
        twitter: string;
        web: string;
       };
    };
  fundingURL: string | false;
  groupIcon: Parameters<typeof groupIconVitePlugin>[0] | false;
  input: string;
  lang: string;
  license: {
     type: string;
     url: string;
    };
  links: Links;
  llms: LlmsConfig | false;
  logo: string;
  meta: Meta;
  moreURL: string | false;
  name: string;
  nav: Nav;
  navLinks: SocialLinks;
  npmURL: string | false;
  og: {
     description: string;
     image: string;
     siteName: string;
     title: string;
     twitterAccount: string;
     url: string;
    };
  oldVersions: {
     name: string;
     url: string;
    }[];
  output: string;
  pwa: Partial<PwaOptions> | false;
  repoURL: string | false;
  rss: RSSOptions;
  server: {
     hotReloadFiles: string[];
     restartFiles: string[];
    };
  shortDesc: string;
  sidebar: Sidebar;
  styles: {
     color: {
        dark: Colors;
        fourth: string;
        light: Colors;
        primary: string;
        secondary: string;
        terciary: string;
       };
     radius: string;
    };
  titleTemplate: (data: {
     name: string;
     title: string;
    }) => string;
  twoslash: Parameters<typeof transformerTwoslash>[0] | false;
  url: string;
  version: string;
  vitepress: UserConfig;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `autoSidebar`? | \{ `about`: `boolean`; `contribute`: `boolean`; `intro`: `boolean`; `reference`: `boolean`; \} | Active or desactivated sidebar autogenerated |
| `autoSidebar.about`? | `boolean` | Display the "About" section in the sidebar. **Default** `true` |
| `autoSidebar.contribute`? | `boolean` | Display the "Contribute" section in the sidebar. **Default** `true` |
| `autoSidebar.intro`? | `boolean` | Display the "Get started" section in the sidebar. **Default** `true` |
| `autoSidebar.reference`? | `boolean` | Display the "Reference" section in the sidebar. **Default** `true` |
| `bugsURL`? | `string` \| `false` | URL for the project's issue tracker or bug reports. |
| `changelogURL`? | `string` \| `false` | CHANGELOG url of the project. |
| `contributingURL`? | `string` \| `false` | Contributing url of the project. |
| `contributors`? | \{ `actionText`: `string`; `avatar`: `string`; `desc`: `string`; `links`: `SocialLinks`; `name`: `string`; `org`: `string`; `orgLink`: `string`; `sponsor`: `string`; `title`: `string`; \}[] | Contributors information including their details and social links. |
| `css`? | `string` | Custom CSS for the documentation site. |
| `desc`? | `string` | - |
| `docsPath`? | `string` | Path to the documentation files. Used for editLink in pages. **Default** `'docs'` |
| `download`? | \{ `groups`: \{\}; `items`: \{\}; \} | Data related to downloads and version releases. |
| `download.groups`? | \{\} | Optional grouping of download items by category. Each key in the object represents a group name and maps to a string label. **Example** `{ 		 * "extension": "extension", 		 * "app": "app", 		 * }` |
| `download.items`? | \{\} | Optional list of downloadable items, where each key represents an item identifier. Each item includes details such as name, URL, and optionally a logo and type. |
| `experimental`? | \{ `noTempDirOnBuild`: `boolean`; \} | Settings for experimental options. **Use at your own risk**. |
| `experimental.noTempDirOnBuild`? | `boolean` | Disable temp directory during compilation. The temp directory is used to store documentation files in the output directory during the compilation process. Used to allow input paths with '../'. **Default** `false` |
| `favicon`? | `string` | Favicon URL for the documentation site. **Default** `'/favicon.png'` |
| `footer`? | \{ `copy`: \{ `name`: `string`; `url`: `string`; \}; `links`: \{ `email`: `string`; `instagram`: `string`; `medium`: `string`; `twitter`: `string`; `web`: `string`; \}; \} | Footer configuration with links and copyright information. |
| `footer.copy`? | \{ `name`: `string`; `url`: `string`; \} | Copyright information for the project. |
| `footer.copy.name`? | `string` | Name to display in copyright notices. |
| `footer.copy.url`? | `string` | URL for the copyright holder or organization. |
| `footer.links`? | \{ `email`: `string`; `instagram`: `string`; `medium`: `string`; `twitter`: `string`; `web`: `string`; \} | Links to various social platforms or contact methods. |
| `footer.links.email`? | `string` | Email link for contacting the project or organization. |
| `footer.links.instagram`? | `string` | Instagram link for the project or organization. |
| `footer.links.medium`? | `string` | Medium link for articles or blogs related to the project. |
| `footer.links.twitter`? | `string` | Twitter link for the project or organization. |
| `footer.links.web`? | `string` | Website link for the project or organization. |
| `fundingURL`? | `string` \| `false` | URL for funding or sponsorship of the project. |
| `groupIcon`? | `Parameters`\<*typeof* `groupIconVitePlugin`\>\[`0`\] \| `false` | Group icon options |
| `input`? | `string` | Input directory for documentation files. **Default** `'./docs'` |
| `lang`? | `string` | Language code for the documentation, e.g., 'en' for English. **Default** `'en'` |
| `license`? | \{ `type`: `string`; `url`: `string`; \} | License information for the project. |
| `license.type`? | `string` | Type of license (e.g., MIT, GPL). **Default** `'MIT'` |
| `license.url`? | `string` | URL to the full license text. |
| `links`? | `Links` | Additional links to display in a special page. |
| `llms`? | `LlmsConfig` \| `false` | Configuration for LLMs text files. **See** https://llmstxt.org/ |
| `logo`? | `string` | Logo URL for the documentation site. **Default** `'/logo.png'` |
| `meta`? | `Meta` | - |
| `moreURL`? | `string` \| `false` | Additional URL for more resources or links related to the project. |
| `name`? | `string` | Name of the project or documentation. **Default** `'DOVENV'` |
| `nav`? | `Nav` | Navigation configuration for links at the top of the documentation. |
| `navLinks`? | `SocialLinks` | Additional navigation links. Icons IDs: https://simpleicons.org/. |
| `npmURL`? | `string` \| `false` | NPM package URL for the project. |
| `og`? | \{ `description`: `string`; `image`: `string`; `siteName`: `string`; `title`: `string`; `twitterAccount`: `string`; `url`: `string`; \} | Open Graph meta tags for better link previews on social media. **Deprecated** |
| `og.description`? | `string` | Description for the Open Graph metadata. |
| `og.image`? | `string` | Image URL for the Open Graph metadata. |
| `og.siteName`? | `string` | Site name for Open Graph metadata. |
| `og.title`? | `string` | Title for the Open Graph metadata. |
| `og.twitterAccount`? | `string` | Twitter account associated with the site. |
| `og.url`? | `string` | URL for the site, used in Open Graph metadata. |
| `oldVersions`? | \{ `name`: `string`; `url`: `string`; \}[] | Array of previous versions of the project, each with a name and a URL. |
| `output`? | `string` | Output directory for the built documentation. **Default** `'./build'` |
| `pwa`? | `Partial`\<`PwaOptions`\> \| `false` | Configuration options for PWA (Progressive Web App) support. |
| `repoURL`? | `string` \| `false` | Repository URL for the project. |
| `rss`? | `RSSOptions` | Configuration options for RSS feed. |
| `server`? | \{ `hotReloadFiles`: `string`[]; `restartFiles`: `string`[]; \} | Server-related configurations, including file watching settings. |
| `server.hotReloadFiles`? | `string`[] | Files that trigger a hot reload on changes. |
| `server.restartFiles`? | `string`[] | Files that trigger a server restart on changes. |
| `shortDesc`? | `string` | A shorter version of the description for better display. |
| `sidebar`? | `Sidebar` | Sidebar configuration for navigation within the documentation. |
| `styles`? | \{ `color`: \{ `dark`: `Colors`; `fourth`: `string`; `light`: `Colors`; `primary`: `string`; `secondary`: `string`; `terciary`: `string`; \}; `radius`: `string`; \} | Custom styles for the documentation site. |
| `styles.color`? | \{ `dark`: `Colors`; `fourth`: `string`; `light`: `Colors`; `primary`: `string`; `secondary`: `string`; `terciary`: `string`; \} | Color scheme for the documentation site. |
| `styles.color.dark`? | `Colors` | Dark mode colors for the theme. |
| `styles.color.fourth`? | `string` | Fourth color for the theme. |
| `styles.color.light`? | `Colors` | Light mode colors for the theme. |
| `styles.color.primary`? | `string` | Primary color for the theme. |
| `styles.color.secondary`? | `string` | Secondary color for the theme. |
| `styles.color.terciary`? | `string` | Tertiary color for the theme. |
| `styles.radius`? | `string` | Border radius for elements in the theme. |
| `titleTemplate`? | (`data`: \{ `name`: `string`; `title`: `string`; \}) => `string` | titleTemplate for the documentation site. |
| `twoslash`? | `Parameters`\<*typeof* `transformerTwoslash`\>\[`0`\] \| `false` | Twoslash options |
| `url`? | `string` | URL of the project or documentation site. |
| `version`? | `string` | - |
| `vitepress`? | `UserConfig` | VitePress user configuration for additional options. |

***

### DocsParams

```ts
type DocsParams: {
  config: Config;
  opts: {
     configPath: string;
     debug: boolean;
     packageJsonPath: string;
     port: number;
    };
  utils: CommandUtils;
};
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `config`? | [`Config`](#config) |
| `opts`? | \{ `configPath`: `string`; `debug`: `boolean`; `packageJsonPath`: `string`; `port`: `number`; \} |
| `opts.configPath`? | `string` |
| `opts.debug`? | `boolean` |
| `opts.packageJsonPath`? | `string` |
| `opts.port`? | `number` |
| `utils` | `CommandUtils` |

## References

### default

Renames and re-exports [docsPlugin](#docsplugin)

## Variables

### autoPWAConfig

```ts
const autoPWAConfig: PwaOptions["pwaAssets"];
```

Configuration for auto PWA assets generation.

**Requires**: `@vite-pwa/assets-generator`.

#### Example

```ts
const docsConfig = {
 pwa: {
   pwaAssets: autoPWAConfig
 }
}
```
