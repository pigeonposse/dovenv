# API

## Functions

### build()

```ts
function build(args: string[]): Promise<void>
```

Runs the build process with the given arguments.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `string`[] | Arguments to pass to the build process. |

#### Returns

`Promise`\<`void`\>

***

### defineConfig()

```ts
function defineConfig(config: Config | Config[]): Config
```

Defines and returns the given configuration object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Config`](api.md#config) \| [`Config`](api.md#config)[] | The configuration object to define. |

#### Returns

[`Config`](api.md#config)

- The defined configuration object.

***

### mergeConfig()

```ts
function mergeConfig(...configs: Config[]): Config
```

Merges multiple configuration objects into a single configuration object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`configs` | [`Config`](api.md#config)[] | The configuration objects to merge. |

#### Returns

[`Config`](api.md#config)

- The merged configuration object.

## Type Aliases

### Config

```ts
type Config: {
  check: CheckConfig;
  const: ConstConfig;
  custom: CustomConfig;
  desc: string;
  name: string;
  template: TemplateConfig;
  transform: TransformConfig;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `check`? | `CheckConfig` | Configuration for the `check` command |
| `const`? | `ConstConfig` | Configuration for set the constants used in templates |
| `custom`? | `CustomConfig` | Configuration for create `custom` commands |
| `desc`? | `string` | Description of the project |
| `name`? | `string` | Name of the project |
| `template`? | `TemplateConfig` | Configuration for the `template` command |
| `transform`? | `TransformConfig` | Configuration for the `transform` command |
