# `@dovenv/templates` - API documentation

## Classes

### Templates

#### Constructors

##### new Templates()

```ts
new Templates(__namedParameters: {
  opts: Config;
  utils: CommandSuper;
 }): Templates
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`Config`](#config) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`Templates`](#templates)

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

##### list()

```ts
list(pattern?: string[]): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern`? | `string`[] |

###### Returns

`Promise`\<`void`\>

##### run()

```ts
run(pattern?: string[]): Promise<undefined | {}>
```

Process templates from the configuration object.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pattern`? | `string`[] | An array of template names to process. If not provided, all templates will be processed. |

###### Returns

`Promise`\<`undefined` \| \{\}\>

A promise that resolves to an object containing the content of each processed template.

#### Properties

| Property | Type |
| ------ | ------ |
| `opts` | `undefined` \| [`Config`](#config) |

## Functions

### templatesPlugin()

```ts
function templatesPlugin(params?: Config): Config
```

A plugin for dovenv to create templates.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | [`Config`](#config) | Optional configuration for the plugin. |

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
