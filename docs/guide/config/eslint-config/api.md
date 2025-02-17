# `@dovenv/eslint-config` - API documentation

## Functions

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

### setTsConfig()

```ts
function setTsConfig(tsconfigRootDir: string): Config
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tsconfigRootDir` | `string` |

#### Returns

`Config`

## References

### default

Renames and re-exports [config](#config)

## Variables

### config

```ts
const config: Config[];
```

***

### cssConfig

```ts
const cssConfig: Config[];
```

YAML Eslint config

#### See

https://github.com/aminya/eslint-plugin-yaml#readme

***

### generalConfig

```ts
const generalConfig: Config[];
```

***

### htmlConfig

```ts
const htmlConfig: Config[];
```

HTML Eslint config

#### See

https://www.npmjs.com/package/eslint-plugin-html

***

### jsConfig

```ts
const jsConfig: Config[];
```

***

### jsonConfig

```ts
const jsonConfig: Config[];
```

***

### mdConfig

```ts
const mdConfig: Config[];
```

MARKDOWN eslint config

#### See

https://gitlab.com/pawelbbdrozd/eslint-plugin-markdownlint

***

### schemaConfig

```ts
const schemaConfig: Config[];
```

***

### tomlConfig

```ts
const tomlConfig: Config[];
```

***

### tsConfig

```ts
const tsConfig: Config[];
```

***

### vueConfig

```ts
const vueConfig: Config[];
```

***

### yamlConfig

```ts
const yamlConfig: Config[];
```
