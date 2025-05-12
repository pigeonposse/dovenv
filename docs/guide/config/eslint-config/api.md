# `@dovenv/eslint-config` - API documentation

## Functions

### experimental\_\_eslintEncreasePerformance()

```ts
function experimental__eslintEncreasePerformance(config: Config[]): Config[]
```

Enhances ESLint configuration performance by modifying file patterns
and rules based on specific conditions.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | `Config`[] | An array of ESLint configuration objects to be processed. |

#### Returns

`Config`[]

The modified configuration array.

***

### includeGitIgnore()

```ts
function includeGitIgnore(gitIgnorePath?: string): Config
```

Include the contents of a .gitignore file in ESLint's ignore configuration.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `gitIgnorePath`? | `string` | The path to the .gitignore file. If not provided, the .gitignore file in the current working directory will be used. |

#### Returns

`Config`

An object that ESLint can use to ignore files.

***

### setConfig()

```ts
function setConfig(props: Partial<ConfigParams>, callback?: (config: Config[]) => Config[]): Config[]
```

Set all eslint config at once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `Partial`\<[`ConfigParams`](#configparams)\> | List of config to enable. |
| `callback`? | (`config`: `Config`[]) => `Config`[] | If provided, the config will be passed to the callback, and the returned value will be used instead of the default config. |

#### Returns

`Config`[]

- The list of config.

***

### setCssConfig()

```ts
function setCssConfig(params?: CssConfigParams): Config[]
```

Generates a CSS ESLint config based on the given parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `CssConfigParams` | Parameters to generate the config. |

#### Returns

`Config`[]

- The generated CSS ESLint config.

#### Example

```ts
// Generates a basic CSS ESLint config.
const config = setCssConfig()

// Generates a CSS ESLint config with tailwind syntax.
const config = setCssConfig({ tailwind: true })

// Generates a CSS ESLint config with postcss syntax.
const config = setCssConfig({ postcss: true })

// Generates a CSS ESLint config with custom rules.
const config = setCssConfig({
  rules: {
  },
})
```

***

### setHtmlConfig()

```ts
function setHtmlConfig(params?: ConfigParamsSuper): Config[]
```

Set HTML ESLint config.

Generates an HTML ESLint config based on the given parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `ConfigParamsSuper` | Custom rules to apply. |

#### Returns

`Config`[]

- The generated HTML ESLint config.

#### See

https://html-eslint.org/docs/rules

#### Example

```ts
// Generates a basic HTML ESLint config.
const config = setHtmlConfig()

// Generates an HTML ESLint config with custom rules.
const config = setHtmlConfig({
  rules: {
    '@html-eslint/indent' : [ 'error', 'tab' ],
    '@html-eslint/sort-attrs' : [ 'error' ],
    // ... other rules
  },
})
```

***

### setIgnoreConfig()

```ts
function setIgnoreConfig(paths: string[]): Config
```

Set paths to ignore in ESLint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `paths` | `string`[] | An array of paths to ignore. |

#### Returns

`Config`

- An object with a single property,
                          `ignores`, that is an array of paths to ignore.

#### Example

```ts
const config = setIgnoreConfig( [
 './static/*',
	'./public/*',
])
```

***

### setJsConfig()

```ts
function setJsConfig(params?: ConfigParamsSuper): Config[]
```

Generates a JS ESLint config based on the given parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `ConfigParamsSuper` | Parameters to customize the config. |

#### Returns

`Config`[]

- The generated JS ESLint config.

#### Example

```ts
// Generates a basic JS ESLint config.
const config = setJsConfig()

// Generates a JS ESLint config with custom rules.
const config = setJsConfig({
  rules: {
  },
})
```

***

### setJSDocConfig()

```ts
function setJSDocConfig(params?: JSDocConfigParmas): Config[]
```

Generates a JSDoc ESLint config based on the given parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `JSDocConfigParmas` | Parameters to generate the config. |

#### Returns

`Config`[]

- The generated JSDoc ESLint config.

#### See

https://github.com/gajus/eslint-plugin-jsdoc

#### Example

```ts
// Generates a basic JSDoc ESLint config.
const config = setJSDocConfig()

// Generates a JSDoc ESLint config with custom rules.
const config = setJSDocConfig({
  rules: {
    'jsdoc/no-types' : [ 'error' ],
  },
})
```

***

### setJsonConfig()

```ts
function setJsonConfig(params?: ConfigParamsSuper): Config[]
```

Generates a JSON ESLint config based on the given parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `ConfigParamsSuper` | Parameters to customize the JSON rules. |

#### Returns

`Config`[]

- The generated JSON ESLint config.

#### See

https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/

#### Example

```ts
// Generates a basic JSON ESLint config.
const config = setJsonConfig()

// Generates a JSON ESLint config with custom rules.
const config = setJsonConfig({
  rules: {
    'jsonc/no-dupe-keys': ['error'],
  },
})
```

***

### setMdConfig()

```ts
function setMdConfig(params?: ConfigParamsSuper): Config[]
```

Defines a configuration object for the dovenv markdown plugin.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `ConfigParamsSuper` | The configuration object. |

#### Returns

`Config`[]

The defined configuration object.
                                   The default configuration is based on the recommended configuration for the
                                   `eslint-plugin-markdownlint` plugin. You can override any of these rules by
                                   passing them as part of the `rules` object in the `params` object.

#### Example

```ts
export default setMdConfig( {
	rules: {
		'markdownlint/md013' : 'error', // line length
		'markdownlint/md024' : 'error', // Multiple headers with the same content
	},
} )
```

***

### setPackageJsonConfig()

```ts
function setPackageJsonConfig(params?: ConfigParamsSuper): Config[]
```

Generates a package.json ESLint config based on the given parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `ConfigParamsSuper` | Parameters to customize the config. |

#### Returns

`Config`[]

- The generated package.json ESLint config.

#### See

https://ota-meshi.github.io/eslint-plugin-package-json

#### Example

```ts
// Generates a basic package.json ESLint config.
const config = setPackageJsonConfig()

// Generates a package.json ESLint config with custom rules.
const config = setPackageJsonConfig({
  rules: {
    'package-json/require-version' : 'error',
  },
})
```

***

### setPlaywrightConfig()

```ts
function setPlaywrightConfig(params?: PlaywrightConfigParams): Config[]
```

Generates a Playwright ESLint config based on the given parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `PlaywrightConfigParams` | Optional parameters to customize the config. |

#### Returns

`Config`[]

- The generated Playwright ESLint config.

#### See

https://www.npmjs.com/package/eslint-plugin-playwright

#### Example

```ts
// Generates a basic Playwright ESLint config.
const config = setPlaywrightConfig()

// Generates a Playwright ESLint config with custom rules.
const config = setPlaywrightConfig({
  rules: {
    'playwright/no-focused-tests': 'error',
  },
})
```

***

### setSchemaConfig()

```ts
function setSchemaConfig(): Config[]
```

Generates a JSON Schema ESLint config based on the given parameters.

#### Returns

`Config`[]

- The generated JSON Schema ESLint config.

#### See

https://ota-meshi.github.io/eslint-plugin-json-schema-validator

#### Example

```ts
// Generates a basic JSON Schema ESLint config.
const config = setSchemaConfig()
```

***

### setSvelteConfig()

```ts
function setSvelteConfig(params?: Partial<SvelteParams>): Config[]
```

SET SVELTE ESLINT CONFIG.

Creates a config for svelte.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `Partial`\<`SvelteParams`\> | Parameters. |

#### Returns

`Config`[]

A list of configurations.

#### See

https://sveltejs.github.io/eslint-plugin-svelte/

***

### setTomlConfig()

```ts
function setTomlConfig(params?: ConfigParamsSuper): Config[]
```

Generates a TOML ESLint config based on the given parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `ConfigParamsSuper` | Parameters to customize the config. |

#### Returns

`Config`[]

- The generated TOML ESLint config.

#### Example

```ts
// Generates a basic TOML ESLint config.
const config = setTomlConfig()

// Generates a TOML ESLint config with custom rules.
const config = setTomlConfig({
  rules: {
    'toml/no-empty-tables': ['error'],
    'toml/no-inline-tables': ['warn'],
  },
})
```

***

### setTsConfig()

```ts
function setTsConfig(params?: ConfigParamsSuper): Config[]
```

Generates a TypeScript ESLint config based on the given parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `ConfigParamsSuper` | Parameters to customize the config. |

#### Returns

`Config`[]

- The generated TypeScript ESLint config.

#### See

https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#recommended

#### Example

```ts
// Generates a basic TypeScript ESLint config.
const config = setTsConfig()

// Generates a TypeScript ESLint config with custom rules.
const config = setTsConfig({
  rules: {
  },
})
```

***

### setTsConfigDir()

```ts
function setTsConfigDir(tsconfigRootDir: string): Config
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tsconfigRootDir` | `string` |

#### Returns

`Config`

***

### setVueConfig()

```ts
function setVueConfig(): Config[]
```

Generates an ESLint configuration for Vue.js files.

This configuration extends the 'flat/strongly-recommended' rules from `eslint-plugin-vue`
and applies specific rules for Vue files.

#### Returns

`Config`[]

An array of configuration objects for Vue.js linting.

#### See

https://www.npmjs.com/package/eslint-plugin-vue

***

### setYamlConfig()

```ts
function setYamlConfig(params?: ConfigParamsSuper): Config[]
```

Generates a YAML ESLint config based on the given parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `ConfigParamsSuper` | Parameters to customize the config. |

#### Returns

`Config`[]

- The generated YAML ESLint config.

#### See

https://ota-meshi.github.io/eslint-plugin-yml/

#### Example

```ts
// Generates a basic YAML ESLint config.
const config = setYamlConfig()

// Generates a YAML ESLint config with custom rules.
const config = setYamlConfig({
  rules: {
    'yml/require-string-key' : [ 'error' ],
  },
})
```

## Type Aliases

### ConfigParams

```ts
type ConfigParams: {
  css: boolean;
  general: "ts" | "js";
  gitignore: boolean | string;
  html: boolean;
  ignore: string[];
  jsdoc: boolean;
  json: boolean;
  md: boolean;
  package: boolean;
  playwright: boolean | Parameters<typeof setPlaywrightConfig>[0];
  schema: boolean;
  svelte: boolean | Parameters<typeof setSvelteConfig>[0];
  toml: boolean;
  vue: boolean;
  yaml: boolean;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `css` | `boolean` | - |
| `general` | `"ts"` \| `"js"` | **Default** `'js'` |
| `gitignore` | `boolean` \| `string` | Ignore files from gitignore. If a string is provided, it will be used as the path to the .gitignore file. **Default** `false` |
| `html` | `boolean` | - |
| `ignore` | `string`[] | Ignore files from a list. |
| `jsdoc` | `boolean` | - |
| `json` | `boolean` | - |
| `md` | `boolean` | - |
| `package` | `boolean` | - |
| `playwright` | `boolean` \| `Parameters`\<*typeof* [`setPlaywrightConfig`](#setplaywrightconfig)\>\[`0`\] | - |
| `schema` | `boolean` | - |
| `svelte` | `boolean` \| `Parameters`\<*typeof* [`setSvelteConfig`](#setsvelteconfig)\>\[`0`\] | - |
| `toml` | `boolean` | - |
| `vue` | `boolean` | - |
| `yaml` | `boolean` | - |

## References

### default

Renames and re-exports [config](#config)

## Variables

### config

```ts
const config: Config[];
```

Default dovenv eslint config.

Includes:
- jsConfig
- tsConfig
- jsdocConfig
- htmlConfig
- mdConfig
- yamlConfig
- jsonConfig
- packageJsonConfig
- tomlConfig.

***

### cssConfig

```ts
const cssConfig: Config[];
```

CSS Eslint config.

#### See

https://github.com/eslint/css

***

### FILES

```ts
const FILES: {
  COMMON: '**/*.{cjs,cts}';
  CSS: '**/*.css';
  ESM: '**/*.{mjs,mts}';
  HTML: '**/*.html';
  JS: '**/*.{js,jsx,cjs,mjs}';
  JSON: '**/*.{json,json5,jsonc}';
  MARKDOWN: '**/*.md';
  PACKAGEJSON: '**/package.json';
  SVELTE: '**/*.svelte';
  SVELTE_FILE: '**/*.svelte.{js,cjs,mjs,ts,cts,mts}';
  TEST_E2E: 'tests/**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}';
  TEST_UNIT: '**/*.{spec,test}.{js,jsx,cjs,mjs,ts,tsx,cts,mts}';
  TOML: '**/*.{toml,tml}';
  TS: '**/*.{ts,tsx,cts,mts}';
  VUE: '**/*.vue';
  YAML: '**/*.{yaml,yml}';
};
```

Constant for file patterns.

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `COMMON` | `"**/*.{cjs,cts}"` | '\*\*/\*.\{cjs,cts\}' |
| `CSS` | `"**/*.css"` | '\*\*/\*.css' |
| `ESM` | `"**/*.{mjs,mts}"` | '\*\*/\*.\{mjs,mts\}' |
| `HTML` | `"**/*.html"` | '\*\*/\*.html' |
| `JS` | `"**/*.{js,jsx,cjs,mjs}"` | '\*\*/\*.\{js,jsx,cjs,mjs\}' |
| `JSON` | `"**/*.{json,json5,jsonc}"` | '\*\*/\*.\{json,json5,jsonc\}' |
| `MARKDOWN` | `"**/*.md"` | '\*\*/\*.md' |
| `PACKAGEJSON` | `"**/package.json"` | '\*\*/package.json' |
| `SVELTE` | `"**/*.svelte"` | '\*\*/\*.svelte' |
| `SVELTE_FILE` | `"**/*.svelte.{js,cjs,mjs,ts,cts,mts}"` | '\*\*/\*.svelte.\{js,cjs,mjs,ts,cts,mts\}' |
| `TEST_E2E` | `"tests/**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}"` | 'tests/\*\*/\*.\{js,jsx,cjs,mjs,ts,tsx,cts,mts\}' |
| `TEST_UNIT` | `"**/*.{spec,test}.{js,jsx,cjs,mjs,ts,tsx,cts,mts}"` | '\*\*/\*.\{spec,test\}.\{js,jsx,cjs,mjs,ts,tsx,cts,mts\}' |
| `TOML` | `"**/*.{toml,tml}"` | '\*\*/\*.\{toml,tml\}' |
| `TS` | `"**/*.{ts,tsx,cts,mts}"` | '\*\*/\*.\{ts,tsx,cts,mts\}' |
| `VUE` | `"**/*.vue"` | '\*\*/\*.vue' |
| `YAML` | `"**/*.{yaml,yml}"` | '\*\*/\*.\{yaml,yml\}' |

***

### htmlConfig

```ts
const htmlConfig: Config[];
```

HTML Eslint config.

#### See

https://html-eslint.org/docs/rules

***

### jsConfig

```ts
const jsConfig: Config[];
```

JS CONFIG FILE.

#### See

https://eslint.org/docs/user-guide/configuring

***

### jsdocConfig

```ts
const jsdocConfig: Config[];
```

JSDOC Eslint config.

#### See

https://github.com/gajus/eslint-plugin-jsdoc#readme

***

### jsonConfig

```ts
const jsonConfig: Config[];
```

JSON ESLINT CONFIG.

#### See

https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/

***

### mdConfig

```ts
const mdConfig: Config[];
```

MARKDOWN eslint config.

#### See

https://gitlab.com/pawelbbdrozd/eslint-plugin-markdownlint

***

### packageJsonConfig

```ts
const packageJsonConfig: Config[];
```

PACKAGE JSON ESLINT CONFIG.

#### See

https://github.com/JoshuaKGoldberg/eslint-plugin-package-json#readme

***

### playwrightConfig

```ts
const playwrightConfig: Config[];
```

PLAYWRIGHT ESLINT CONFIG.

#### See

https://www.npmjs.com/package/eslint-plugin-playwright

***

### schemaConfig

```ts
const schemaConfig: Config[];
```

SCHEMA ESLINT CONFIG.

#### See

https://ota-meshi.github.io/eslint-plugin-json-schema-validator

***

### tomlConfig

```ts
const tomlConfig: Config[];
```

TOML ESLINT CONFIG.

#### See

https://www.npmjs.com/package/eslint-plugin-toml

***

### tsConfig

```ts
const tsConfig: Config[];
```

TYPESCRIPT (TS).

Includes: jsConfig.

#### See

https://typescript-eslint.io/getting-started/

***

### vueConfig

```ts
const vueConfig: Config[];
```

VUE ESLINT CONFIG.

#### See

https://www.npmjs.com/package/eslint-plugin-vue

***

### yamlConfig

```ts
const yamlConfig: Config[];
```

YAML ESLINT CONFIG.

#### See

https://ota-meshi.github.io/eslint-plugin-yml/
