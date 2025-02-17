# `@dovenv/lint` - API documentation

## Classes

### CommitLint

#### Extends

- `LintSuper`\<`CommitlintConfig`\>

#### Constructors

##### new CommitLint()

```ts
new CommitLint(opts: undefined | CommitlintConfig, utils: CommandSuper): CommitLint
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `undefined` \| `CommitlintConfig` |
| `utils` | `CommandSuper` |

###### Returns

[`CommitLint`](#commitlint)

###### Inherited from

`LintSuper<CommitlintConfig>.constructor`

#### Methods

##### run()

```ts
run(userMsg?: string): Promise<undefined | void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `userMsg`? | `string` |

###### Returns

`Promise`\<`undefined` \| `void`\>

#### Properties

| Property | Modifier | Type | Inherited from |
| ------ | ------ | ------ | ------ |
| `opts` | `public` | `undefined` \| `CommitlintConfig` | `LintSuper.opts` |
| `utils` | `public` | `CommandSuper` | `LintSuper.utils` |

***

### Eslint

#### Extends

- `LintSuper`\<`EslintConfig`\>

#### Constructors

##### new Eslint()

```ts
new Eslint(opts: undefined | EslintConfig, utils: CommandSuper): Eslint
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `undefined` \| `EslintConfig` |
| `utils` | `CommandSuper` |

###### Returns

[`Eslint`](#eslint)

###### Inherited from

`LintSuper<EslintConfig>.constructor`

#### Methods

##### run()

```ts
run(flags?: string[]): Promise<undefined | void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flags`? | `string`[] |

###### Returns

`Promise`\<`undefined` \| `void`\>

#### Properties

| Property | Modifier | Type | Inherited from |
| ------ | ------ | ------ | ------ |
| `opts` | `public` | `undefined` \| `EslintConfig` | `LintSuper.opts` |
| `utils` | `public` | `CommandSuper` | `LintSuper.utils` |

***

### Lint

Lint class with all lint functions

#### Extends

- `LintSuper`\<[`Config`](#config)\>

#### Constructors

##### new Lint()

```ts
new Lint(opts: undefined | Config, utils: CommandSuper): Lint
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `undefined` \| [`Config`](#config) |
| `utils` | `CommandSuper` |

###### Returns

[`Lint`](#lint)

###### Inherited from

`LintSuper<Config>.constructor`

#### Methods

##### commitlint()

```ts
commitlint(userMsg?: string): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `userMsg`? | `string` |

###### Returns

`Promise`\<`void`\>

##### custom()

```ts
custom(pattern?: string[]): Promise<undefined | void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern`? | `string`[] |

###### Returns

`Promise`\<`undefined` \| `void`\>

##### eslint()

```ts
eslint(flags: string[]): Promise<undefined | void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flags` | `string`[] |

###### Returns

`Promise`\<`undefined` \| `void`\>

##### staged()

```ts
staged(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### stylelint()

```ts
stylelint(files?: string[], fix?: boolean): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `files`? | `string`[] |
| `fix`? | `boolean` |

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Modifier | Type | Inherited from |
| ------ | ------ | ------ | ------ |
| `opts` | `public` | `undefined` \| [`Config`](#config) | `LintSuper.opts` |
| `utils` | `public` | `CommandSuper` | `LintSuper.utils` |

***

### StagedLint

#### Extends

- `LintSuper`\<`LintStagedConfig`\>

#### Constructors

##### new StagedLint()

```ts
new StagedLint(opts: undefined | LintStagedConfig, utils: CommandSuper): StagedLint
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `undefined` \| `LintStagedConfig` |
| `utils` | `CommandSuper` |

###### Returns

[`StagedLint`](#stagedlint)

###### Inherited from

`LintSuper<LintStagedConfig>.constructor`

#### Methods

##### run()

```ts
run(): Promise<undefined | void>
```

###### Returns

`Promise`\<`undefined` \| `void`\>

#### Properties

| Property | Modifier | Type | Inherited from |
| ------ | ------ | ------ | ------ |
| `opts` | `public` | `undefined` \| `LintStagedConfig` | `LintSuper.opts` |
| `utils` | `public` | `CommandSuper` | `LintSuper.utils` |

***

### StyleLint

#### Extends

- `LintSuper`\<`StylelintConfig`\>

#### Constructors

##### new StyleLint()

```ts
new StyleLint(opts: undefined | LinterOptions, utils: CommandSuper): StyleLint
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `undefined` \| `LinterOptions` |
| `utils` | `CommandSuper` |

###### Returns

[`StyleLint`](#stylelint-1)

###### Inherited from

`LintSuper<StylelintConfig>.constructor`

#### Methods

##### run()

```ts
run(files?: string[], fix?: boolean): Promise<undefined | void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `files`? | `string`[] |
| `fix`? | `boolean` |

###### Returns

`Promise`\<`undefined` \| `void`\>

#### Properties

| Property | Modifier | Type | Inherited from |
| ------ | ------ | ------ | ------ |
| `opts` | `public` | `undefined` \| `LinterOptions` | `LintSuper.opts` |
| `utils` | `public` | `CommandSuper` | `LintSuper.utils` |

## Functions

### lintPlugin()

```ts
function lintPlugin(conf?: Config): Config
```

Configures and returns a DovenvConfig object for linting tools.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `conf`? | [`Config`](#config) | Optional configuration object for linting. |

#### Returns

`Config`

A configuration object with custom lint commands and descriptions.

Provides linting commands for different file types and commit messages:
- `staged`: Lints staged git files.
- `stylelint`: Lints CSS/SCSS/LESS/SASS/PostCSS files with options to fix errors and specify files.
- `eslint`: Lints JS/TS/MD/JSON/YAML files.
- `commitlint`: Lints commit messages, either the last commit message or a specified message.

Examples include linting CSS files, JS files, commit messages, and staged files.

## Type Aliases

### Config

```ts
type Config: {
  commitlint: CommitlintConfig;
  custom: { [key in string]: Function };
  eslint: EslintConfig;
  staged: LintStagedConfig;
  stylelint: StylelintConfig;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `commitlint`? | `CommitlintConfig` | Config for lint commit messages |
| `custom`? | `{ [key in string]: Function }` | - |
| `eslint`? | `EslintConfig` | Config for lint JS/TS/MD/JSON/YAML.. files |
| `staged`? | `LintStagedConfig` | Config for lint staged GIT files |
| `stylelint`? | `StylelintConfig` | Config for lint CSS/SCSS/LESS/SASS/PostCSS files |

## References

### default

Renames and re-exports [lintPlugin](#lintplugin)

## Namespaces

- [dovenvEslintConfig](namespaces/dovenvEslintConfig.md)
- [dovenvStylelintConfig](namespaces/dovenvStylelintConfig.md)
