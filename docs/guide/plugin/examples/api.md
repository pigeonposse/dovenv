# `@dovenv/examples` - API documentation

## Classes

### Examples

#### Constructors

##### new Examples()

```ts
new Examples(data: {
  opts: Config;
  utils: CommandSuper;
 }): Examples
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `object` |
| `data.opts`? | [`Config`](#config) |
| `data.utils` | `CommandSuper` |

###### Returns

[`Examples`](#examples)

#### Methods

##### fromConfig()

```ts
fromConfig(data: {
  config: ExampleProps<ExampleProps>;
  desc: string;
  input: string | ExampleProps<ExampleProps>;
  output: string;
  title: string | false;
}): Promise<string>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `object` | - |
| `data.config`? | `ExampleProps`\<`ExampleProps`\> | Override your config input. |
| `data.desc`? | `string` | Description. **Default** `'Examples'` |
| `data.input` | `string` \| `ExampleProps`\<`ExampleProps`\> | Input of your config (path or config object). Path formats: JSON, YAML, TOML JS etc. |
| `data.output`? | `string` | Write a output if you want |
| `data.title`? | `string` \| `false` | H1 for markdown. **Default** `'Examples'` |

###### Returns

`Promise`\<`string`\>

##### fromCustom()

```ts
fromCustom(data: ExampleCustomProps): Promise<unknown>
```

Processes custom example data using provided handlers.

This method allows dynamic processing of example data based on the type
by binding specific handler functions for each type. The function received
in the data parameter is invoked with an object containing these handlers.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | [`ExampleCustomProps`](#examplecustomprops) | Object containing the function to execute with the handlers. |

###### Returns

`Promise`\<`unknown`\>

A promise that resolves to the result of the executed function.

##### fromJsdoc()

```ts
fromJsdoc(data: {
  desc: string;
  input: string[];
  opts: Options;
  output: string;
  title: string | false;
}): Promise<string>
```

Process jsdoc examples.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `object` | Example data. |
| `data.desc`? | `string` | Description. **Default** `'Examples'` |
| `data.input` | `string`[] | Input pattern. |
| `data.opts`? | `Options` | Options for input patterns |
| `data.output`? | `string` | Write a output if you want |
| `data.title`? | `string` \| `false` | H1 for markdown. **Default** `'Examples'` |

###### Returns

`Promise`\<`string`\>

Resolved example content.

###### See

https://github.com/jsdoc2md/jsdoc-api/blob/master/docs/api.md

##### fromMultiple()

```ts
fromMultiple(data: {
  config: Omit<{
     config: ExampleProps<ExampleProps>;
     desc: string;
     input: string | ExampleProps<ExampleProps>;
     output: string;
     title: string | false;
    }, "output">;
  desc: string;
  jsdoc: Omit<{
     desc: string;
     input: string[];
     opts: Options;
     output: string;
     title: string | false;
    }, "output">;
  output: string;
  path: Omit<{
     desc: string;
     input: string[];
     opts: Options;
     output: string;
     title: string | false;
    }, "output">;
  title: string | false;
}): Promise<string>
```

Process multiple examples.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `object` | Example data. |
| `data.config`? | `Omit`\<\{ `config`: `ExampleProps`\<`ExampleProps`\>; `desc`: `string`; `input`: `string` \| `ExampleProps`\<`ExampleProps`\>; `output`: `string`; `title`: `string` \| `false`; \}, `"output"`\> | - |
| `data.desc`? | `string` | Description. **Default** `'Examples'` |
| `data.jsdoc`? | `Omit`\<\{ `desc`: `string`; `input`: `string`[]; `opts`: `Options`; `output`: `string`; `title`: `string` \| `false`; \}, `"output"`\> | - |
| `data.output`? | `string` | Write a output if you want |
| `data.path`? | `Omit`\<\{ `desc`: `string`; `input`: `string`[]; `opts`: `Options`; `output`: `string`; `title`: `string` \| `false`; \}, `"output"`\> | - |
| `data.title`? | `string` \| `false` | H1 for markdown. **Default** `'Examples'` |

###### Returns

`Promise`\<`string`\>

Resolved example content.

##### fromPath()

```ts
fromPath(data: {
  desc: string;
  input: string[];
  opts: Options;
  output: string;
  title: string | false;
}): Promise<string>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `object` | - |
| `data.desc`? | `string` | Description. **Default** `'Examples'` |
| `data.input` | `string`[] | Input pattern. |
| `data.opts`? | `Options` | Options for input patterns |
| `data.output`? | `string` | Write a output if you want |
| `data.title`? | `string` \| `false` | H1 for markdown. **Default** `'Examples'` |

###### Returns

`Promise`\<`string`\>

##### get()

```ts
get(data: ConfigValue): Promise<any>
```

Get a custom Example content template.

Perfect method to be used outside an `Dovenv` environment.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `ConfigValue` | Configuration object. |

###### Returns

`Promise`\<`any`\>

A promise that resolves to the processed content as a string.

##### run()

```ts
run(pattern?: string[]): Promise<undefined | {}>
```

Process examples from the configuration object.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pattern`? | `string`[] | An array of examples names to process. If not provided, all examples will be processed. |

###### Returns

`Promise`\<`undefined` \| \{\}\>

A promise that resolves to an object containing the content of each processed example.

#### Properties

| Property | Type | Default value |
| ------ | ------ | ------ |
| `const` | `__module` | `consts` |
| `opts` | `undefined` \| [`Config`](#config) | `undefined` |

## Functions

### examplesPlugin()

```ts
function examplesPlugin(conf?: Config): Config
```

A plugin for `dovenv` providing tools for managing example paths.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `conf`? | [`Config`](#config) | Configuration for the plugin. |

#### Returns

`Config`

- The plugin configuration with custom examples.

## Type Aliases

### Config

```ts
type Config: { [key in string]: ConfigValue };
```

***

### ExampleConfigFileProps

```ts
type ExampleConfigFileProps: Prettify<Shared & {
  config: ExampleConfig;
  input: string | ExampleConfig;
}>;
```

***

### ExampleCustomProps

```ts
type ExampleCustomProps: {
  fn: (data: {
     config: DovenvConfig;
     run: {
        config: (data: ExampleConfigFileProps) => Promise<string>;
        jsdoc: (data: ExampleJsdocProps) => Promise<string>;
        multiple: (data: ExampleMultipleProps) => Promise<string>;
        path: (data: ExamplePathProps) => Promise<string>;
       };
    }) => Promise<unknown>;
};
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `fn` | (`data`: \{ `config`: `DovenvConfig`; `run`: \{ `config`: (`data`: [`ExampleConfigFileProps`](#exampleconfigfileprops)) => `Promise`\<`string`\>; `jsdoc`: (`data`: [`ExampleJsdocProps`](#examplejsdocprops)) => `Promise`\<`string`\>; `multiple`: (`data`: [`ExampleMultipleProps`](#examplemultipleprops)) => `Promise`\<`string`\>; `path`: (`data`: [`ExamplePathProps`](#examplepathprops)) => `Promise`\<`string`\>; \}; \}) => `Promise`\<`unknown`\> |

***

### ExampleJsdocProps

```ts
type ExampleJsdocProps: ExamplePathProps;
```

***

### ExampleMultipleProps

```ts
type ExampleMultipleProps: Prettify<Shared & {
  config: Omit<ExampleConfigFileProps, "output">;
  jsdoc: Omit<ExampleJsdocProps, "output">;
  path: Omit<ExamplePathProps, "output">;
}>;
```

***

### ExamplePathProps

```ts
type ExamplePathProps: Prettify<Shared & {
  input: string[];
  opts: Parameters<typeof getPaths>[1];
}>;
```

## References

### default

Renames and re-exports [examplesPlugin](#examplesplugin)
