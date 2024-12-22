# `@dovenv/workspace` - Api documentation

## Classes

### Workspace

#### Constructors

##### new Workspace()

```ts
new Workspace(opts?: Config, config?: Config): Workspace
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | [`Config`](#config) |
| `config`? | `Config` |

###### Returns

[`Workspace`](#workspace)

#### Methods

##### audit()

```ts
audit(fix?: boolean): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `fix`? | `boolean` |

###### Returns

`Promise`\<`void`\>

##### check()

```ts
check(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### custom()

```ts
custom(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### donate()

```ts
donate(open: boolean): Promise<void>
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `open` | `boolean` | `true` |

###### Returns

`Promise`\<`void`\>

##### exec()

```ts
exec(cmd: string, opts?: string[]): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `cmd` | `string` |
| `opts`? | `string`[] |

###### Returns

`Promise`\<`void`\>

##### getPkgPaths()

```ts
getPkgPaths(): Promise<string[]>
```

###### Returns

`Promise`\<`string`[]\>

##### info()

```ts
info(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### instructions()

```ts
instructions(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### outdated()

```ts
outdated(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### reinstall()

```ts
reinstall(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### scripts()

```ts
scripts(opts?: string[]): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | `string`[] |

###### Returns

`Promise`\<`void`\>

##### size()

```ts
size(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### structure()

```ts
structure(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### usefulCmds()

```ts
usefulCmds(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

## Functions

### workspacePlugin()

```ts
function workspacePlugin(params?: Config): Config
```

Workspace plugin for Dovenv.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | [`Config`](#config) | Plugin config. |

#### Returns

`Config`

- A config with commands for workspace.

#### Example

```ts
import { defineConfig } from '@dovenv/core'
import { workspacePlugin } from '@dovenv/workspace'

export default defineConfig( workspacePlugin() )
```

## Type Aliases

### Config

```ts
type Config: {
  check: {
     pkg: Prettify<Sharedcheck & {
        schema: (opts: {
           config: DovenvConfig;
           content: PackageJSON;
           path: string;
           v: Validate;
          }) => Promise<ValidateAnyType | void> | ValidateAnyType | void;
       }>;
    };
  custom: { [key in string]: Function };
  exec: { [key in string]: Object };
  info: {
     instructions: string;
     structure: object;
     usefulCmds: {
        cmd: string;
        desc: string;
        info: string;
       }[];
    };
  reinstall: {
     hook: {
        after: () => Promise<void>;
        before: () => Promise<void>;
       };
    };
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `check`? | \{ `pkg`: `Prettify`\<`Sharedcheck` & \{ `schema`: (`opts`: \{ `config`: `DovenvConfig`; `content`: `PackageJSON`; `path`: `string`; `v`: `Validate`; \}) => `Promise`\<`ValidateAnyType` \| `void`\> \| `ValidateAnyType` \| `void`; \}\>; \} | - |
| `check.pkg`? | `Prettify`\<`Sharedcheck` & \{ `schema`: (`opts`: \{ `config`: `DovenvConfig`; `content`: `PackageJSON`; `path`: `string`; `v`: `Validate`; \}) => `Promise`\<`ValidateAnyType` \| `void`\> \| `ValidateAnyType` \| `void`; \}\> | Checks for packages |
| `custom`? | `{ [key in string]: Function }` | custom configration for ws |
| `exec`? | `{ [key in string]: Object }` | List of commands for run |
| `info`? | \{ `instructions`: `string`; `structure`: `object`; `usefulCmds`: \{ `cmd`: `string`; `desc`: `string`; `info`: `string`; \}[]; \} | Information for the workspace |
| `info.instructions`? | `string` | Instructions for the workspace. Must be markdown format. Accepts string, URL or path **Example** `## Pre-requisites project needs the following tools to work: - `node` > 20 installed - `pnpm` > 9 installed - `gh` > 2 installed - `git` > 2 installed ## Init workspace pnpm install` |
| `info.structure`? | `object` | Structure of the workspace |
| `info.usefulCmds`? | \{ `cmd`: `string`; `desc`: `string`; `info`: `string`; \}[] | Add more commands to the list of useful commands **Example** `usefullCmds : [ 	{ 		desc : 'Checks for outdated packages.', 		cmd : 'pnpm -r outdated', 	}, ]` |
| `reinstall`? | \{ `hook`: \{ `after`: () => `Promise`\<`void`\>; `before`: () => `Promise`\<`void`\>; \}; \} | Reinstall the workspace options |
| `reinstall.hook`? | \{ `after`: () => `Promise`\<`void`\>; `before`: () => `Promise`\<`void`\>; \} | - |
| `reinstall.hook.after`? | () => `Promise`\<`void`\> | Hook after reinstallation |
| `reinstall.hook.before`? | () => `Promise`\<`void`\> | Hook before reinstallation |

## References

### default

Renames and re-exports [workspacePlugin](#workspaceplugin)