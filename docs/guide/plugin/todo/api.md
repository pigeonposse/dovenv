# `@dovenv/todo` - API documentation

## Classes

### Todo

#### Extends

- `PluginCore`\<[`Config`](#config)\>

#### Constructors

##### new Todo()

```ts
new Todo(opts?: Config, config?: Config): Todo
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | [`Config`](#config) |
| `config`? | `Config` |

###### Returns

[`Todo`](#todo)

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
| `helpURL` | `string` | `homepage` | Help url for your application | `PluginCore.helpURL` | - |
| `opts` | `undefined` \| [`Config`](#config) | `undefined` | Configuration options. | - | `PluginCore.opts` |
| `title` | `string` | `'todo'` | - | `PluginCore.title` | - |

## Functions

### todoPlugin()

```ts
function todoPlugin(conf?: Config): Config
```

A plugin for dovenv to get TODOs in a workspace.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `conf`? | [`Config`](#config) | Configuration for the plugin. |

#### Returns

`Config`

- The plugin.
import { defineConfig } from '@dovenv/core'
import { todoPlugin } from '@dovenv/todo'
export default defineConfig(
    todoPlugin( {
      example : {
        input : [ 'src/*.{ts,tsx,js,jsx,md}' ],
      },
    } ),
)

## Type Aliases

### Config

```ts
type Config: { [key in string]: Object };
```

## References

### default

Renames and re-exports [todoPlugin](#todoplugin)
