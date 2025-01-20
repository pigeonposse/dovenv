# `@dovenv/lint` - API documentation

## Classes

### CommitLint

#### Extends

- `LintSuper`\<`CommitlintConfig`\>

#### Constructors

##### new CommitLint()

```ts
new CommitLint(opts?: CommitlintConfig, config?: Config): CommitLint
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | `CommitlintConfig` |
| `config`? | `Config` |

###### Returns

[`CommitLint`](#commitlint)

###### Inherited from

`LintSuper<CommitlintConfig>.constructor`

#### Methods

##### run()

```ts
run(userMsg?: string): Promise<unknown>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `userMsg`? | `string` |

###### Returns

`Promise`\<`unknown`\>

#### Properties

| Property | Type | Default value | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `config` | `undefined` \| `Config` | `undefined` | The dovenv configuration. | - | `LintSuper.config` |
| `helpURL` | `string` | `homepage` | Help url for your application | - | `LintSuper.helpURL` |
| `opts` | `undefined` \| `CommitlintConfig` | `undefined` | Configuration options. | - | `LintSuper.opts` |
| `title` | `"commitlint"` | `CMDS.commitlint` | - | `LintSuper.title` | - |

***

### Eslint

#### Extends

- `LintSuper`\<`EslintConfig`\>

#### Constructors

##### new Eslint()

```ts
new Eslint(opts?: EslintConfig, config?: Config): Eslint
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | `EslintConfig` |
| `config`? | `Config` |

###### Returns

[`Eslint`](#eslint)

###### Inherited from

`LintSuper<EslintConfig>.constructor`

#### Methods

##### run()

```ts
run(flags?: string[]): Promise<unknown>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flags`? | `string`[] |

###### Returns

`Promise`\<`unknown`\>

#### Properties

| Property | Type | Default value | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `config` | `undefined` \| `Config` | `undefined` | The dovenv configuration. | - | `LintSuper.config` |
| `helpURL` | `string` | `homepage` | Help url for your application | - | `LintSuper.helpURL` |
| `opts` | `undefined` \| `EslintConfig` | `undefined` | Configuration options. | - | `LintSuper.opts` |
| `title` | `"eslint"` | `CMDS.eslint` | - | `LintSuper.title` | - |

***

### Lint

Lint class with all lint functions

#### Extends

- `LintSuper`\<[`Config`](#config)\>

#### Constructors

##### new Lint()

```ts
new Lint(opts?: Config, config?: Config): Lint
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | [`Config`](#config) |
| `config`? | `Config` |

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
custom(pattern?: string[]): Promise<unknown>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern`? | `string`[] |

###### Returns

`Promise`\<`unknown`\>

##### eslint()

```ts
eslint(flags: string[]): Promise<unknown>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flags` | `string`[] |

###### Returns

`Promise`\<`unknown`\>

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

| Property | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| `config` | `undefined` \| `Config` | `undefined` | The dovenv configuration. | `LintSuper.config` |
| `helpURL` | `string` | `homepage` | Help url for your application | `LintSuper.helpURL` |
| `opts` | `undefined` \| [`Config`](#config) | `undefined` | Configuration options. | `LintSuper.opts` |
| `title` | `string` | `'lint'` | - | `LintSuper.title` |

***

### StagedLint

#### Extends

- `LintSuper`\<`LintStagedConfig`\>

#### Constructors

##### new StagedLint()

```ts
new StagedLint(opts?: LintStagedConfig, config?: Config): StagedLint
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | `LintStagedConfig` |
| `config`? | `Config` |

###### Returns

[`StagedLint`](#stagedlint)

###### Inherited from

`LintSuper<LintStagedConfig>.constructor`

#### Methods

##### run()

```ts
run(): Promise<unknown>
```

###### Returns

`Promise`\<`unknown`\>

#### Properties

| Property | Type | Default value | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `config` | `undefined` \| `Config` | `undefined` | The dovenv configuration. | - | `LintSuper.config` |
| `helpURL` | `string` | `homepage` | Help url for your application | - | `LintSuper.helpURL` |
| `opts` | `undefined` \| `LintStagedConfig` | `undefined` | Configuration options. | - | `LintSuper.opts` |
| `title` | `"staged"` | `CMDS.staged` | - | `LintSuper.title` | - |

***

### StyleLint

#### Extends

- `LintSuper`\<`StylelintConfig`\>

#### Constructors

##### new StyleLint()

```ts
new StyleLint(opts?: LinterOptions, config?: Config): StyleLint
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | `LinterOptions` |
| `config`? | `Config` |

###### Returns

[`StyleLint`](#stylelint-1)

###### Inherited from

`LintSuper<StylelintConfig>.constructor`

#### Methods

##### run()

```ts
run(files?: string[], fix?: boolean): Promise<unknown>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `files`? | `string`[] |
| `fix`? | `boolean` |

###### Returns

`Promise`\<`unknown`\>

#### Properties

| Property | Type | Default value | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `config` | `undefined` \| `Config` | `undefined` | The dovenv configuration. | - | `LintSuper.config` |
| `helpURL` | `string` | `homepage` | Help url for your application | - | `LintSuper.helpURL` |
| `opts` | `undefined` \| `LinterOptions` | `undefined` | Configuration options. | - | `LintSuper.opts` |
| `title` | `"stylelint"` | `CMDS.stylelint` | - | `LintSuper.title` | - |

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
