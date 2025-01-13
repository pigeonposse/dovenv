# `@dovenv/convert` - API documentation

## Classes

### Convert

Convertion class

#### Example

```ts
// convert ts files to markdown
const convert = new Convert()
await convert.ts2md({input: 'src/main.ts', output: 'README.md' })
```

#### Implements

- `ConvertInterface`

#### Constructors

##### new Convert()

```ts
new Convert(): Convert
```

###### Returns

[`Convert`](#convert)

#### Methods

##### custom()

```ts
custom(params: {
  fn: (data: {
     config: Config;
     run: {
        html2md: (params: ConvertPropsSuper) => Promise<{
           content: string;
           id: i.id;
          }[]>;
        jsdoc2md: (params: Jsdoc2MarkdownProps) => Promise<{
           content: string;
           id: i.id;
          }[]>;
        md2html: (params: ConvertPropsSuper) => Promise<{
           content: string;
           id: i.id;
          }[]>;
        openapi2md: (params: Openapi2MarkdownProps) => Promise<{
           content: string;
           id: i.id;
          }[]>;
        ts2html: (params: {
           input: string | string[];
           opts: {
              hooks: {
                 after: ... | ...;
                 before: ... | ...;
                };
              name: string;
              packageJsonPath: string;
              transform: (content: string) => Promise<...>;
              tsconfigPath: string;
              typedoc: Partial<Omit<..., ...>>;
             };
           output: string;
          }) => Promise<{
           content: string;
           id: path;
          }[]>;
        ts2md: (params: {
           input: string | string[];
           opts: {
              hooks: {
                 after: ... | ...;
                 before: ... | ...;
                };
              name: string;
              packageJsonPath: string;
              transform: (content: string) => Promise<...>;
              tsconfigPath: string;
              typedoc: Partial<Omit<..., ...>>;
              typedocMarkdown: Partial<PluginOptions>;
             };
           output: string;
          }) => Promise<{
           content: string;
           id: path;
          }[]>;
       };
    }) => Promise<void>;
}): Promise<void>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` | - |
| `params.fn` | (`data`: \{ `config`: `Config`; `run`: \{ `html2md`: (`params`: `ConvertPropsSuper`) => `Promise`\<\{ `content`: `string`; `id`: `i.id`; \}[]\>; `jsdoc2md`: (`params`: `Jsdoc2MarkdownProps`) => `Promise`\<\{ `content`: `string`; `id`: `i.id`; \}[]\>; `md2html`: (`params`: `ConvertPropsSuper`) => `Promise`\<\{ `content`: `string`; `id`: `i.id`; \}[]\>; `openapi2md`: (`params`: `Openapi2MarkdownProps`) => `Promise`\<\{ `content`: `string`; `id`: `i.id`; \}[]\>; `ts2html`: (`params`: \{ `input`: `string` \| `string`[]; `opts`: \{ `hooks`: \{ `after`: ... \| ...; `before`: ... \| ...; \}; `name`: `string`; `packageJsonPath`: `string`; `transform`: (`content`: `string`) => `Promise`\<...\>; `tsconfigPath`: `string`; `typedoc`: `Partial`\<`Omit`\<..., ...\>\>; \}; `output`: `string`; \}) => `Promise`\<\{ `content`: `string`; `id`: `path`; \}[]\>; `ts2md`: (`params`: \{ `input`: `string` \| `string`[]; `opts`: \{ `hooks`: \{ `after`: ... \| ...; `before`: ... \| ...; \}; `name`: `string`; `packageJsonPath`: `string`; `transform`: (`content`: `string`) => `Promise`\<...\>; `tsconfigPath`: `string`; `typedoc`: `Partial`\<`Omit`\<..., ...\>\>; `typedocMarkdown`: `Partial`\<`PluginOptions`\>; \}; `output`: `string`; \}) => `Promise`\<\{ `content`: `string`; `id`: `path`; \}[]\>; \}; \}) => `Promise`\<`void`\> | Function to run your conversion. |

###### Returns

`Promise`\<`void`\>

###### Implementation of

`ConvertInterface.custom`

##### html2md()

```ts
html2md(params: ConvertPropsSuper): Promise<{
  content: string;
  id: i.id;
}[]>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `ConvertPropsSuper` |

###### Returns

`Promise`\<\{
  `content`: `string`;
  `id`: `i.id`;
 \}[]\>

###### Implementation of

`ConvertInterface.html2md`

##### jsdoc2md()

```ts
jsdoc2md(params: Jsdoc2MarkdownProps): Promise<{
  content: string;
  id: i.id;
}[]>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `Jsdoc2MarkdownProps` |

###### Returns

`Promise`\<\{
  `content`: `string`;
  `id`: `i.id`;
 \}[]\>

###### Implementation of

`ConvertInterface.jsdoc2md`

##### md2html()

```ts
md2html(params: ConvertPropsSuper): Promise<{
  content: string;
  id: i.id;
}[]>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `ConvertPropsSuper` |

###### Returns

`Promise`\<\{
  `content`: `string`;
  `id`: `i.id`;
 \}[]\>

###### Implementation of

`ConvertInterface.md2html`

##### openapi2md()

```ts
openapi2md(params: Openapi2MarkdownProps): Promise<{
  content: string;
  id: i.id;
}[]>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `Openapi2MarkdownProps` |

###### Returns

`Promise`\<\{
  `content`: `string`;
  `id`: `i.id`;
 \}[]\>

###### Implementation of

`ConvertInterface.openapi2md`

##### ts2html()

```ts
ts2html(params: {
  input: string | string[];
  opts: {
     hooks: {
        after: () => string | Promise<string>;
        before: () => string | Promise<string>;
       };
     name: string;
     packageJsonPath: string;
     transform: (content: string) => Promise<string>;
     tsconfigPath: string;
     typedoc: Partial<Omit<TypeDocOptions, "plugin" | "tsconfig" | "entryPoints" | "out">>;
    };
  output: string;
 }): Promise<{
  content: string;
  id: path;
}[]>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` | - |
| `params.input` | `string` \| `string`[] | Input patterns. Accepts glob patterns, urls, and strings. **Examples** `[ 'https://pigeonposse.com', './docs/*.md', 'Just a simple string' ]` `'./my/file'` `'https://pigeonposse.com'` `'my content string data'` |
| `params.opts`? | `object` | Options **See** https://dovenv.pigeonposse.com/guide/plugin/convert |
| `params.opts.hooks`? | `object` | Hooks. |
| `params.opts.hooks.after`? | () => `string` \| `Promise`\<`string`\> | - |
| `params.opts.hooks.before`? | () => `string` \| `Promise`\<`string`\> | - |
| `params.opts.name`? | `string` | Name of your project. |
| `params.opts.packageJsonPath`? | `string` | __Package.json path__. This path is used to extract specific properties from the `package.json` file. **Default** `join( process.cwd(), "package.json" )` |
| `params.opts.transform`? | (`content`: `string`) => `Promise`\<`string`\> | Transform function. |
| `params.opts.tsconfigPath`? | `string` | __Cuaton tsconfig path__. Used for getting the ts config of the output. **Default** `join( process.cwd(), "tsconfig.ts" )` |
| `params.opts.typedoc`? | `Partial`\<`Omit`\<`TypeDocOptions`, `"plugin"` \| `"tsconfig"` \| `"entryPoints"` \| `"out"`\>\> | Typedoc options **See** https://typedoc.org/options/ |
| `params.output`? | `string` | Output path |

###### Returns

`Promise`\<\{
  `content`: `string`;
  `id`: `path`;
 \}[]\>

###### Implementation of

`ConvertInterface.ts2html`

##### ts2md()

```ts
ts2md(params: {
  input: string | string[];
  opts: {
     hooks: {
        after: () => string | Promise<string>;
        before: () => string | Promise<string>;
       };
     name: string;
     packageJsonPath: string;
     transform: (content: string) => Promise<string>;
     tsconfigPath: string;
     typedoc: Partial<Omit<TypeDocOptions, "plugin" | "tsconfig" | "entryPoints" | "out">>;
     typedocMarkdown: Partial<PluginOptions>;
    };
  output: string;
 }): Promise<{
  content: string;
  id: path;
}[]>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` | - |
| `params.input` | `string` \| `string`[] | Input patterns. Accepts glob patterns, urls, and strings. **Examples** `[ 'https://pigeonposse.com', './docs/*.md', 'Just a simple string' ]` `'./my/file'` `'https://pigeonposse.com'` `'my content string data'` |
| `params.opts`? | `object` | Options **See** https://dovenv.pigeonposse.com/guide/plugin/convert |
| `params.opts.hooks`? | `object` | Hooks. |
| `params.opts.hooks.after`? | () => `string` \| `Promise`\<`string`\> | - |
| `params.opts.hooks.before`? | () => `string` \| `Promise`\<`string`\> | - |
| `params.opts.name`? | `string` | Name of your project. |
| `params.opts.packageJsonPath`? | `string` | __Package.json path__. This path is used to extract specific properties from the `package.json` file. **Default** `join( process.cwd(), "package.json" )` |
| `params.opts.transform`? | (`content`: `string`) => `Promise`\<`string`\> | Transform function. |
| `params.opts.tsconfigPath`? | `string` | __Cuaton tsconfig path__. Used for getting the ts config of the output. **Default** `join( process.cwd(), "tsconfig.ts" )` |
| `params.opts.typedoc`? | `Partial`\<`Omit`\<`TypeDocOptions`, `"plugin"` \| `"tsconfig"` \| `"entryPoints"` \| `"out"`\>\> | Typedoc options **See** https://typedoc.org/options/ |
| `params.opts.typedocMarkdown`? | `Partial`\<`PluginOptions`\> | Typedoc markdown options **See** - - https://typedoc-plugin-markdown.org/docs/options |
| `params.output`? | `string` | Output path |

###### Returns

`Promise`\<\{
  `content`: `string`;
  `id`: `path`;
 \}[]\>

###### Implementation of

`ConvertInterface.ts2md`

#### Properties

| Property | Type | Default value |
| ------ | ------ | ------ |
| `config` | `Config` | `{}` |

***

### Html2Markdown

#### Extends

- `ConvertSuper`\<`Html2MarkdownProps`\>

#### Constructors

##### new Html2Markdown()

```ts
new Html2Markdown(props: ConvertPropsSuper): Html2Markdown
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `ConvertPropsSuper` |

###### Returns

[`Html2Markdown`](#html2markdown)

###### Overrides

`ConvertSuper<Html2MarkdownProps>.constructor`

#### Methods

##### run()

```ts
run(): Promise<{
  content: string;
  id: i.id;
}[]>
```

###### Returns

`Promise`\<\{
  `content`: `string`;
  `id`: `i.id`;
 \}[]\>

#### Properties

| Property | Type | Overrides |
| ------ | ------ | ------ |
| `props` | `ConvertPropsSuper` | `ConvertSuper.props` |

***

### Jsdoc2Markdown

#### Extends

- `ConvertSuper`\<`Jsdoc2MarkdownProps`\>

#### Implements

- `ConvertSuperInterface`

#### Constructors

##### new Jsdoc2Markdown()

```ts
new Jsdoc2Markdown(props: Jsdoc2MarkdownProps): Jsdoc2Markdown
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `Jsdoc2MarkdownProps` |

###### Returns

[`Jsdoc2Markdown`](#jsdoc2markdown)

###### Overrides

`ConvertSuper<Jsdoc2MarkdownProps>.constructor`

#### Methods

##### run()

```ts
run(): Promise<{
  content: string;
  id: i.id;
}[]>
```

###### Returns

`Promise`\<\{
  `content`: `string`;
  `id`: `i.id`;
 \}[]\>

###### Implementation of

`ConvertSuperInterface.run`

#### Properties

| Property | Type | Overrides |
| ------ | ------ | ------ |
| `props` | `Jsdoc2MarkdownProps` | `ConvertSuper.props` |

***

### Markdown2Html

#### Extends

- `ConvertSuper`\<`Markdown2HtmlProps`\>

#### Implements

- `ConvertSuperInterface`

#### Constructors

##### new Markdown2Html()

```ts
new Markdown2Html(props: ConvertPropsSuper): Markdown2Html
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `ConvertPropsSuper` |

###### Returns

[`Markdown2Html`](#markdown2html)

###### Overrides

`ConvertSuper<Markdown2HtmlProps>.constructor`

#### Methods

##### run()

```ts
run(): Promise<{
  content: string;
  id: i.id;
}[]>
```

###### Returns

`Promise`\<\{
  `content`: `string`;
  `id`: `i.id`;
 \}[]\>

###### Implementation of

`ConvertSuperInterface.run`

#### Properties

| Property | Type | Overrides |
| ------ | ------ | ------ |
| `props` | `ConvertPropsSuper` | `ConvertSuper.props` |

***

### MultipleConvert

#### Extends

- `PluginCore`\<[`Config`](#config)\>

#### Constructors

##### new MultipleConvert()

```ts
new MultipleConvert(opts?: Config, config?: Config): MultipleConvert
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | [`Config`](#config) |
| `config`? | `Config` |

###### Returns

[`MultipleConvert`](#multipleconvert)

###### Inherited from

`PluginCore<Config>.constructor`

#### Methods

##### execPkgBin()

```ts
execPkgBin(
   name: string, 
   args?: string[], 
   opts?: {
  forceExec: boolean;
  path: string;
}): Promise<void>
```

Executes a binary from a local package or falls back to the package manager if it's not installed.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The name of the package whose binary you want to execute. |
| `args`? | `string`[] | An optional array of arguments to pass to the binary. |
| `opts`? | `object` | Options- |
| `opts.forceExec`? | `boolean` | Force execution with current package manager and not check if exists in 'node_modules' **Default** `false` |
| `opts.path`? | `string` | **`Experimental`** Custom path from package root. Only affects when name no exists in node_modules |

###### Returns

`Promise`\<`void`\>

A promise that resolves when the execution is complete.

###### Throws

If an error occurs during execution, it triggers the `onCancel` method.

###### Example

```ts
await execPkgBin('@changesets/cli', ['--help']);
```

###### Inherited from

`PluginCore.execPkgBin`

##### run()

```ts
run(pattern?: string[]): Promise<unknown>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern`? | `string`[] |

###### Returns

`Promise`\<`unknown`\>

#### Properties

| Property | Type | Default value | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `config` | `undefined` \| `Config` | `undefined` | The dovenv configuration. | - | `PluginCore.config` |
| `convert` | [`Convert`](#convert) | `undefined` | - | - | - |
| `opts` | `undefined` \| [`Config`](#config) | `undefined` | Configuration options. | - | `PluginCore.opts` |
| `title` | `string` | `'convert'` | - | `PluginCore.title` | - |

***

### Openapi2Markdown

#### Extends

- `ConvertSuper`\<`Openapi2MarkdownProps`\>

#### Implements

- `ConvertSuperInterface`

#### Constructors

##### new Openapi2Markdown()

```ts
new Openapi2Markdown(props: Openapi2MarkdownProps): Openapi2Markdown
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `Openapi2MarkdownProps` |

###### Returns

[`Openapi2Markdown`](#openapi2markdown)

###### Overrides

`ConvertSuper<Openapi2MarkdownProps>.constructor`

#### Methods

##### run()

```ts
run(): Promise<{
  content: string;
  id: i.id;
}[]>
```

###### Returns

`Promise`\<\{
  `content`: `string`;
  `id`: `i.id`;
 \}[]\>

###### Implementation of

`ConvertSuperInterface.run`

#### Properties

| Property | Type | Overrides |
| ------ | ------ | ------ |
| `props` | `Openapi2MarkdownProps` | `ConvertSuper.props` |

***

### Typescript2Markdown

#### Extends

- `TypescriptSuper`\<`Typescript2MarkdownProps`\>

#### Implements

- `ConvertSuperInterface`

#### Constructors

##### new Typescript2Markdown()

```ts
new Typescript2Markdown(props: {
  input: string | string[];
  opts: {
     hooks: {
        after: () => string | Promise<string>;
        before: () => string | Promise<string>;
       };
     name: string;
     packageJsonPath: string;
     transform: (content: string) => Promise<string>;
     tsconfigPath: string;
     typedoc: Partial<Omit<TypeDocOptions, "plugin" | "tsconfig" | "entryPoints" | "out">>;
     typedocMarkdown: Partial<PluginOptions>;
    };
  output: string;
 }): Typescript2Markdown
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `object` | - |
| `props.input` | `string` \| `string`[] | Input patterns. Accepts glob patterns, urls, and strings. **Examples** `[ 'https://pigeonposse.com', './docs/*.md', 'Just a simple string' ]` `'./my/file'` `'https://pigeonposse.com'` `'my content string data'` |
| `props.opts`? | `object` | Options **See** https://dovenv.pigeonposse.com/guide/plugin/convert |
| `props.opts.hooks`? | `object` | Hooks. |
| `props.opts.hooks.after`? | () => `string` \| `Promise`\<`string`\> | - |
| `props.opts.hooks.before`? | () => `string` \| `Promise`\<`string`\> | - |
| `props.opts.name`? | `string` | Name of your project. |
| `props.opts.packageJsonPath`? | `string` | __Package.json path__. This path is used to extract specific properties from the `package.json` file. **Default** `join( process.cwd(), "package.json" )` |
| `props.opts.transform`? | (`content`: `string`) => `Promise`\<`string`\> | Transform function. |
| `props.opts.tsconfigPath`? | `string` | __Cuaton tsconfig path__. Used for getting the ts config of the output. **Default** `join( process.cwd(), "tsconfig.ts" )` |
| `props.opts.typedoc`? | `Partial`\<`Omit`\<`TypeDocOptions`, `"plugin"` \| `"tsconfig"` \| `"entryPoints"` \| `"out"`\>\> | Typedoc options **See** https://typedoc.org/options/ |
| `props.opts.typedocMarkdown`? | `Partial`\<`PluginOptions`\> | Typedoc markdown options **See** - - https://typedoc-plugin-markdown.org/docs/options |
| `props.output`? | `string` | Output path |

###### Returns

[`Typescript2Markdown`](#typescript2markdown)

###### Overrides

`TypescriptSuper<Typescript2MarkdownProps>.constructor`

#### Methods

##### run()

```ts
run(): Promise<{
  content: string;
  id: path;
}[]>
```

###### Returns

`Promise`\<\{
  `content`: `string`;
  `id`: `path`;
 \}[]\>

###### Implementation of

`ConvertSuperInterface.run`

##### runTypedoc()

```ts
runTypedoc<C>(customConf?: C): Promise<{
  content: string;
  id: path;
}[]>
```

###### Type Parameters

| Type Parameter |
| ------ |
| `C` *extends* `Record`\<`string`, `unknown`\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `customConf`? | `C` |

###### Returns

`Promise`\<\{
  `content`: `string`;
  `id`: `path`;
 \}[]\>

###### Inherited from

`TypescriptSuper.runTypedoc`

#### Properties

| Property | Type | Description | Overrides |
| ------ | ------ | ------ | ------ |
| `props` | \{ `input`: `string` \| `string`[]; `opts`: \{ `hooks`: \{ `after`: () => `string` \| `Promise`\<`string`\>; `before`: () => `string` \| `Promise`\<`string`\>; \}; `name`: `string`; `packageJsonPath`: `string`; `transform`: (`content`: `string`) => `Promise`\<`string`\>; `tsconfigPath`: `string`; `typedoc`: `Partial`\<`Omit`\<`TypeDocOptions`, `"plugin"` \| `"tsconfig"` \| `"entryPoints"` \| `"out"`\>\>; `typedocMarkdown`: `Partial`\<`PluginOptions`\>; \}; `output`: `string`; \} | - | `TypescriptSuper.props` |
| `props.input` | `string` \| `string`[] | Input patterns. Accepts glob patterns, urls, and strings. **Examples** `[ 'https://pigeonposse.com', './docs/*.md', 'Just a simple string' ]` `'./my/file'` `'https://pigeonposse.com'` `'my content string data'` | - |
| `props.opts?` | \{ `hooks`: \{ `after`: () => `string` \| `Promise`\<`string`\>; `before`: () => `string` \| `Promise`\<`string`\>; \}; `name`: `string`; `packageJsonPath`: `string`; `transform`: (`content`: `string`) => `Promise`\<`string`\>; `tsconfigPath`: `string`; `typedoc`: `Partial`\<`Omit`\<`TypeDocOptions`, `"plugin"` \| `"tsconfig"` \| `"entryPoints"` \| `"out"`\>\>; `typedocMarkdown`: `Partial`\<`PluginOptions`\>; \} | Options **See** https://dovenv.pigeonposse.com/guide/plugin/convert | - |
| `props.opts.hooks?` | \{ `after`: () => `string` \| `Promise`\<`string`\>; `before`: () => `string` \| `Promise`\<`string`\>; \} | Hooks. | - |
| `props.opts.hooks.after?` | () => `string` \| `Promise`\<`string`\> | - | - |
| `props.opts.hooks.before?` | () => `string` \| `Promise`\<`string`\> | - | - |
| `props.opts.name?` | `string` | Name of your project. | - |
| `props.opts.packageJsonPath?` | `string` | __Package.json path__. This path is used to extract specific properties from the `package.json` file. **Default** `join( process.cwd(), "package.json" )` | - |
| `props.opts.transform?` | (`content`: `string`) => `Promise`\<`string`\> | Transform function. | - |
| `props.opts.tsconfigPath?` | `string` | __Cuaton tsconfig path__. Used for getting the ts config of the output. **Default** `join( process.cwd(), "tsconfig.ts" )` | - |
| `props.opts.typedoc?` | `Partial`\<`Omit`\<`TypeDocOptions`, `"plugin"` \| `"tsconfig"` \| `"entryPoints"` \| `"out"`\>\> | Typedoc options **See** https://typedoc.org/options/ | - |
| `props.opts.typedocMarkdown?` | `Partial`\<`PluginOptions`\> | Typedoc markdown options **See** - - https://typedoc-plugin-markdown.org/docs/options | - |
| `props.output?` | `string` | Output path | - |

## Functions

### convertPlugin()

```ts
function convertPlugin(conf?: Config): Config
```

A plugin for `dovenv` to convert files from one format to another.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `conf`? | [`Config`](#config) | Configuration for the plugin. |

#### Returns

`Config`

- The plugin.

#### Example

```ts
import { defineConfig } from '@dovenv/core'
import { convertPlugin } from '@dovenv/convert'
export default defineConfig(
    convertPlugin( {
      exampleJSDOC: {
        type: 'jsdoc2md',
        input: 'examples/recourses/main.js',
        output: 'build/jsdoc',
      },
      exampleTS: {
        type: 'ts2md',
        input: 'examples/recourses/main.ts',
        output: 'build/ts',
      },
      exampleHTML: {
        type: 'md2html',
        input: 'https://raw.githubusercontent.com/pigeonposse/backan/refs/heads/main/README.md',
        output: 'build/html',
      },
    } ),
)
```

## Type Aliases

### Config

```ts
type Config: { [key in string]: ConfigValue };
```

## References

### default

Renames and re-exports [convertPlugin](#convertplugin)
