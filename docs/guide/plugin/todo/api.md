# `@dovenv/todo` - API documentation

## Classes

### Todo

#### Constructors

##### new Todo()

```ts
new Todo(__namedParameters: {
  opts: Config;
  utils: CommandSuper;
 }): Todo
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`Config`](#config) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`Todo`](#todo)

#### Methods

##### run()

```ts
run(pattern?: string[]): Promise<undefined | TodoComment[]>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern`? | `string`[] |

###### Returns

`Promise`\<`undefined` \| `TodoComment`[]\>

#### Properties

| Property | Type |
| ------ | ------ |
| `opts` | `undefined` \| [`Config`](#config) |
| `utils` | `CommandSuper` |

## Functions

### todoPlugin()

```ts
function todoPlugin(params?: Config): Config
```

A plugin for dovenv to get TODOs in a workspace.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | [`Config`](#config) | Configuration for the plugin. |

#### Returns

`Config`

- The plugin.

#### Example

```ts
import { defineConfig } from '@dovenv/core'
import { todoPlugin } from '@dovenv/todo'
export default defineConfig( todoPlugin( {
    example : {
      input : [ 'src/*.{ts,tsx,js,jsx,md}' ],
    },
 } )).
```

## Type Aliases

### Config

```ts
type Config: { [key in string]: Object };
```

## References

### default

Renames and re-exports [todoPlugin](#todoplugin)
