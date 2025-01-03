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
