# `@dovenv/core` - API documentation

## Classes

### Dovenv

Instance `Dovenv`.

This is the "dovenv" class that builds the command line interface.

It is similar to the cli tool but for use in `js`|`ts` projects.

Provides tools for managing configurations, constants, and path transformations etc.
Supports custom configurations and predefined commands.
Features:
- Validate files or directories with custom rules.
- Manage workspace constants efficiently.
- Transform paths with configurable patterns.
- Extend or override default behaviors with custom configurations.

---

#### See

https://dovenv.pigeonposse.com/guide/core

#### Example

```ts
// Create an instance with custom configurations
const dovenv = new Dovenv({
  config: {
    check: {
      pkg: { include: ['src/**'], ... }
    },
  }
});

// Run a predefined action
await dovenv.run(['check', '-k', 'pkg']);
```

#### Constructors

##### new Dovenv()

```ts
new Dovenv(params?: Params): Dovenv
```

Creates a new `Dovenv` instance.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | [`Params`](#params) | Optional initialization parameters. |

###### Returns

[`Dovenv`](#dovenv)

#### Methods

##### run()

```ts
run(args: string[]): Promise<void>
```

Runs the build process with the given arguments.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `args` | `string`[] | `[]` | Arguments to pass to the run process. |

###### Returns

`Promise`\<`void`\>

###### Example

```ts
const dovenv = new Dovenv({
  config: {
    check: {
      pkg: {...}
    },
    ...
  }
})
await dovenv.run(['check', '-k', 'pkg'])
```

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| `config` | `undefined` \| [`Config`](#config) | Configuration object for commands and options of the `Dovenv` instance. |
| `dovenvConfigPath` | `undefined` \| `string` | Contains Dovenv config path. This property is used for user information purposes only. If the "config" option is added via the class constructor, this option will be undefined. In this case you can change its value, but this may alter the behavior of the class. Do so at your own risk. |

***

### PluginCore\<Opts\>

Plugin core class.

- Contains the plugin utilities, styles etc.
- Makes it easy to create plugins.

#### See

https://dovenv.pigeonposse.com/guide/plugin

#### Extends

- `CommandSuper`\<`Opts`\>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Opts` | `undefined` |

#### Constructors

##### new PluginCore()

```ts
new PluginCore<Opts>(opts?: Opts, config?: Config): PluginCore<Opts>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | `Opts` |
| `config`? | [`Config`](#config) |

###### Returns

[`PluginCore`](#plugincoreopts)\<`Opts`\>

###### Overrides

`CommandSuper<Opts>.constructor`

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

`CommandSuper.execPkgBin`

#### Properties

| Property | Type | Default value | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `config` | `undefined` \| [`Config`](#config) | `undefined` | The dovenv configuration. | - | `CommandSuper.config` |
| `opts` | `undefined` \| `Opts` | `undefined` | Configuration options. | - | `CommandSuper.opts` |
| `title` | `string` | `'plugin'` | The title of the application. Use in internal logs and functions. | `CommandSuper.title` | - |

## Functions

### createPlugin()

```ts
function createPlugin<Param>(fn: (data: {
  param: Param;
  utils: PluginCore<Param>;
 }) => Config, dovenvConfig?: Config): (param?: Param) => Config
```

Create a plugin function.

#### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `Param` | `unknown` | The type of the arguments to be passed to the plugin. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`data`: \{ `param`: `Param`; `utils`: [`PluginCore`](#plugincoreopts)\<`Param`\>; \}) => [`Config`](#config) | The plugin function. |
| `dovenvConfig`? | [`Config`](#config) | Add a previous dovenv configuration if you need it. |

#### Returns

`Function`

- The plugin function that can be passed to the dovenv.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `param`? | `Param` |

##### Returns

[`Config`](#config)

#### Example

```ts
import { createPlugin } from '@dovenv/core'

const plugin = createPlugin<{ title?: boolean }>( data => {
	 if ( data.param?.title ) {
		console.log( data.utils.style.title( 'Hello from plugin' ) )
	 }

	return {
		// Your dovenv configuration here.
	}
} )
```

***

### defineConfig()

```ts
function defineConfig(...config: (Config | Config[])[]): Config
```

Defines and returns the given configuration object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`config` | ([`Config`](#config) \| [`Config`](#config)[])[] | The configuration object to define. |

#### Returns

[`Config`](#config)

- The defined configuration object.

#### See

https://dovenv.pigeonposse.com/guide/core

---

#### Examples

```ts
// Example 1: A single configuration object
export default defineConfig(config1);
```

```ts
// Example 2: Multiple configurations as arguments
export default defineConfig(config1, config2);
```

```ts
// Example 3: An array of configurations
export default defineConfig([config1, config2]);
```

***

### run()

```ts
function run(args: string[]): Promise<void>
```

Runs the build process with the given arguments.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `string`[] | Arguments to pass to the build process. |

#### Returns

`Promise`\<`void`\>

#### Example

```ts
import { run } from '@dovenv/core'

await run(['-c', 'my/config.js', 'check'])
```

## Type Aliases

### Config

```ts
type Config: {
  alias: AliasesConfig;
  check: CheckConfig;
  const: ConstConfig;
  custom: CustomConfig;
  desc: string;
  name: string;
  transform: TransformConfig;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `alias`? | `AliasesConfig` | Configuration for the `aliases` |
| `check`? | `CheckConfig` | Configuration for the `check` command |
| `const`? | `ConstConfig` | Configuration for set the constants used in templates |
| `custom`? | `CustomConfig` | Configuration for create `custom` commands |
| `desc`? | `string` | Description of the project |
| `name`? | `string` | Name of the project |
| `transform`? | `TransformConfig` | Configuration for the `transform` command |

***

### Params

```ts
type Params: {
  config: Config;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `config`? | [`Config`](#config) | Configuration for dovenv **See** https://dovenv.pigeonposse.com/guide/core/api#config |
