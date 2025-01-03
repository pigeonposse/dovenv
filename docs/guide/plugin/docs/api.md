# `@dovenv/docs` - API documentation

## Classes

### Docs

Documentation class

For `build`, `dev` and `preview` documentation pages

#### Constructors

##### new Docs()

```ts
new Docs(conf?: DocsConfig, opts?: DocsParams): Docs
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `conf`? | [`DocsConfig`](#docsconfig) |
| `opts`? | `DocsParams` |

###### Returns

[`Docs`](#docs)

#### Methods

##### build()

```ts
build(flags?: string[]): Promise<void>
```

__Builds the documentation site__.

This command is a wrapper of the `npx vitepress build` command.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `flags`? | `string`[] | Flags to pass to the underlying `vitepress build` command. This allows for customization and control over the build process. |

###### Returns

`Promise`\<`void`\>

##### dev()

```ts
dev(flags?: string[]): Promise<void>
```

__Starts the development server__.

This command is a wrapper of the `npx vitepress dev` command.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `flags`? | `string`[] | Flags to pass to the underlying `vitepress dev` command. The `--force` flag is always passed to ensure the server starts without prompting the user. |

###### Returns

`Promise`\<`void`\>

##### preview()

```ts
preview(flags?: string[]): Promise<void>
```

__Starts the preview server__.

This command is a wrapper of the `npx vitepress preview` command.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `flags`? | `string`[] | Flags to pass to the underlying `vitepress preview` command. This allows for customization and control over the preview process. |

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type |
| ------ | ------ |
| `config` | `undefined` \| [`DocsConfig`](#docsconfig) |
| `opts` | `DocsParams` |
| `outputReplaced` | \{ `start`: () => `void`; `stop`: () => `void`; \} |
| `outputReplaced.start` | () => `void` |
| `outputReplaced.stop` | () => `void` |

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

### docsPlugin()

```ts
function docsPlugin(conf?: DocsPluginConfig): Config
```

Define a `dovenv` configuration that creates a documentation site for your workspace.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `conf`? | [`DocsPluginConfig`](#docspluginconfig) | The configuration object. |

#### Returns

`Config`

The dovenv configuration object.

***

### getPkgConfig()

```ts
function getPkgConfig(pkgData: JSONSchemaForNPMPackageJsonFiles): Promise<DocsConfig>
```

Extracts and constructs documentation configuration from package JSON data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pkgData` | `JSONSchemaForNPMPackageJsonFiles` | The package JSON data object. |

#### Returns

`Promise`\<[`DocsConfig`](#docsconfig)\>

A promise that resolves to a `DocsConfig` object containing extracted configuration details like funding URL, bugs URL, license, homepage URL, description, name, version, and contributors.

## Type Aliases

### DocsConfig

```ts
type DocsConfig: {
  autoSidebar: {
     about: boolean;
     contribute: boolean;
     intro: boolean;
     reference: boolean;
    };
  bugsURL: string;
  changelogURL: string;
  contributingURL: string;
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
  fundingURL: string;
  input: string;
  lang: string;
  license: {
     type: string;
     url: string;
    };
  links: Links;
  logo: string;
  moreURL: string;
  name: string;
  nav: Nav;
  navLinks: SocialLinks;
  npmURL: string;
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
  pwa: Partial<VitePWAOptions> | false;
  repoURL: string;
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
| `bugsURL`? | `string` | URL for the project's issue tracker or bug reports. |
| `changelogURL`? | `string` | CHANGELOG url of the project. |
| `contributingURL`? | `string` | contributing url of the project. |
| `contributors`? | \{ `actionText`: `string`; `avatar`: `string`; `desc`: `string`; `links`: `SocialLinks`; `name`: `string`; `org`: `string`; `orgLink`: `string`; `sponsor`: `string`; `title`: `string`; \}[] | Contributors information including their details and social links. |
| `css`? | `string` | Custom CSS for the documentation site. |
| `desc`? | `string` | - |
| `docsPath`? | `string` | Path to the documentation files. Used for editLink in pages **Default** `'docs'` |
| `download`? | \{ `groups`: \{\}; `items`: \{\}; \} | Data related to downloads and version releases. |
| `download.groups`? | \{\} | Optional grouping of download items by category. Each key in the object represents a group name and maps to a string label. **Example** `{ 		 * "extension": "extension", 		 * "app": "app", 		 * }` |
| `download.items`? | \{\} | Optional list of downloadable items, where each key represents an item identifier. Each item includes details such as name, URL, and optionally a logo and type. |
| `experimental`? | \{ `noTempDirOnBuild`: `boolean`; \} | Settings for experimental options. **Use at your own risk** |
| `experimental.noTempDirOnBuild`? | `boolean` | Disable temp directory during compilation. The temp directory is used to store documentation files in the output directory during the compilation process. Used to allow input paths with '../' **Default** `false` |
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
| `fundingURL`? | `string` | URL for funding or sponsorship of the project. |
| `input`? | `string` | Input directory for documentation files. **Default** `'./docs'` |
| `lang`? | `string` | Language code for the documentation, e.g., 'en' for English. **Default** `'en'` |
| `license`? | \{ `type`: `string`; `url`: `string`; \} | License information for the project. |
| `license.type`? | `string` | Type of license (e.g., MIT, GPL). **Default** `'MIT'` |
| `license.url`? | `string` | URL to the full license text. |
| `links`? | `Links` | Additional links to display in a special page. |
| `logo`? | `string` | Logo URL for the documentation site. **Default** `'/logo.png'` |
| `moreURL`? | `string` | Additional URL for more resources or links related to the project. |
| `name`? | `string` | Name of the project or documentation. **Default** `'DOVENV'` |
| `nav`? | `Nav` | Navigation configuration for links at the top of the documentation. |
| `navLinks`? | `SocialLinks` | Additional navigation links. Icons IDs: https://simpleicons.org/ |
| `npmURL`? | `string` | NPM package URL for the project. |
| `og`? | \{ `description`: `string`; `image`: `string`; `siteName`: `string`; `title`: `string`; `twitterAccount`: `string`; `url`: `string`; \} | Open Graph meta tags for better link previews on social media. |
| `og.description`? | `string` | Description for the Open Graph metadata. |
| `og.image`? | `string` | Image URL for the Open Graph metadata. |
| `og.siteName`? | `string` | Site name for Open Graph metadata. |
| `og.title`? | `string` | Title for the Open Graph metadata. |
| `og.twitterAccount`? | `string` | Twitter account associated with the site. |
| `og.url`? | `string` | URL for the site, used in Open Graph metadata. |
| `oldVersions`? | \{ `name`: `string`; `url`: `string`; \}[] | Array of previous versions of the project, each with a name and a URL. |
| `output`? | `string` | Output directory for the built documentation. **Default** `'./build'` |
| `pwa`? | `Partial`\<`VitePWAOptions`\> \| `false` | Configuration options for PWA (Progressive Web App) support. |
| `repoURL`? | `string` | Repository URL for the project. |
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
| `url`? | `string` | URL of the project or documentation site. |
| `version`? | `string` | Version of the project. |
| `vitepress`? | `UserConfig` | VitePress user configuration for additional options. |

***

### DocsPluginConfig

```ts
type DocsPluginConfig: DocsConfig | (config?: DovenvConfig) => Promise<DocsConfig>;
```

## References

### default

Renames and re-exports [docsPlugin](#docsplugin)
