# `@dovenv/templates` - API documentation

## Classes

### Templates

#### Extends

- `PluginCore`\<[`Config`](#config)\>

#### Constructors

##### new Templates()

```ts
new Templates(opts?: Config, config?: Config): Templates
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | [`Config`](#config) |
| `config`? | `Config` |

###### Returns

[`Templates`](#templates)

###### Inherited from

`PluginCore<Config>.constructor`

#### Methods

##### get()

```ts
get(data: ConfigValue): Promise<string>
```

Get a custom template.

Perfect method to be used outside an `Dovenv` environment.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `ConfigValue` | Configuration object containing input details, constants, and optional output path. |

###### Returns

`Promise`\<`string`\>

A promise that resolves to the processed content as a string.

##### run()

```ts
run(pattern?: string[]): Promise<unknown>
```

Process templates from the configuration object.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pattern`? | `string`[] | An array of template names to process. If not provided, all templates will be processed. |

###### Returns

`Promise`\<`unknown`\>

A promise that resolves to an object containing the content of each processed template.

#### Properties

| Property | Type | Default value | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `config` | `undefined` \| `Config` | `undefined` | The dovenv configuration. | - | `PluginCore.config` |
| `helpURL` | `string` | `homepage` | Help url for your application | `PluginCore.helpURL` | - |
| `opts` | `undefined` \| [`Config`](#config) | `undefined` | Configuration options. | - | `PluginCore.opts` |
| `title` | `string` | `'templates'` | - | `PluginCore.title` | - |

## Functions

### templatesPlugin()

```ts
function templatesPlugin(conf?: Config): Config
```

A plugin for dovenv to create templates.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `conf`? | [`Config`](#config) | Optional configuration for the plugin. |

#### Returns

`Config`

## Type Aliases

### Config

```ts
type Config: { [key in string]: ConfigValue };
```

## References

### default

Renames and re-exports [templatesPlugin](#templatesplugin)
