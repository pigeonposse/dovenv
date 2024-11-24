# dovenv

[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com?popup=about)
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/?popup=donate)
[![Github](https://img.shields.io/badge/Github-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pigeonposse)
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/pigeonposse_)
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/pigeon.posse/)
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@pigeonposse)

Quickly and easily set up your environment for your code projects

## Table of contents

- [🔑 Installation](#-installation)
- [Api documentation](#api-documentation)
  - [Classes](#classes)
    - [Dovenv](#dovenv)
  - [Functions](#functions)
    - [defineConfig()](#defineconfig)
    - [run()](#run)
  - [Type Aliases](#type-aliases)
    - [Config](#config)
    - [Params](#params)
- [👨‍💻 Development](#-development)
- [☕ Donate](#-donate)
- [📜 License](#-license)
- [🐦 About us](#-about-us)

## 🔑 Installation

```bash
npm install dovenv
# or pnpm
pnpm add dovenv
# or yarn
yarn add dovenv
```

## Api documentation

### Classes

#### Dovenv

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

##### See

<https://dovenv.pigeonposse.com/guide/core>

##### Example

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

##### Constructors

###### new Dovenv()

```ts
new Dovenv(params?: Params): Dovenv
```

Creates a new `Dovenv` instance.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | [`Params`](index.md#params) | Optional initialization parameters. |

###### Returns

[`Dovenv`](index.md#dovenv)

##### Methods

###### run()

```ts
run(args: string[]): Promise<void>
```

Runs the build process with the given arguments.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `string`[] | Arguments to pass to the run process. |

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

##### Properties

| Property | Type |
| ------ | ------ |
| `config` | `undefined` \| [`Config`](index.md#config) |

### Functions

#### defineConfig()

```ts
function defineConfig(...config: (Config | Config[])[]): Config
```

Defines and returns the given configuration object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`config` | ([`Config`](index.md#config) \| [`Config`](index.md#config)[])[] | The configuration object to define. |

##### Returns

[`Config`](index.md#config)

- The defined configuration object.

##### See

<https://dovenv.pigeonposse.com/guide/core>

---

##### Examples

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

#### run()

```ts
function run(args: string[]): Promise<void>
```

Runs the build process with the given arguments.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `string`[] | Arguments to pass to the build process. |

##### Returns

`Promise`\<`void`\>

##### Example

```ts
import { run } from 'dovenv'

await run(['-c', 'my/config.js', 'check'])
```

### Type Aliases

#### Config

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

##### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `check`? | `CheckConfig` | Configuration for the `check` command |
| `const`? | `ConstConfig` | Configuration for set the constants used in templates |
| `custom`? | `CustomConfig` | Configuration for create `custom` commands |
| `desc`? | `string` | Description of the project |
| `name`? | `string` | Name of the project |
| `template`? | `TemplateConfig` | Configuration for the `template` command |
| `transform`? | `TransformConfig` | Configuration for the `transform` command |

***

#### Params

```ts
type Params: {
  config: Config;
};
```

##### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `config`? | [`Config`](index.md#config) | Configuration for dovenv **See** <https://dovenv.pigeonposse.com/guide/core/config> |

***

## 👨‍💻 Development

**dovenv** is an open-source project and its development is open to anyone who wants to participate.

[![Issues](https://img.shields.io/badge/Issues-grey?style=for-the-badge)](https://github.com/pigeonposse/dovenv/issues)
[![Pull requests](https://img.shields.io/badge/Pulls-grey?style=for-the-badge)](https://github.com/pigeonposse/dovenv/pulls)
[![Read more](https://img.shields.io/badge/Read%20more-grey?style=for-the-badge)](https://github.com/pigeonposse/dovenv)

## ☕ Donate

Help us to develop more interesting things.

[![Donate](https://img.shields.io/badge/Donate-grey?style=for-the-badge)](https://pigeonposse.com/?popup=donate)

## 📜 License

This software is licensed with **[GPL-3.0](https://github.com/pigeonposse/dovenv/blob/main/LICENSE)**.

[![Read more](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](https://github.com/pigeonposse/dovenv/blob/main/LICENSE)

## 🐦 About us

*PigeonPosse* is a ✨ **code development collective** ✨ focused on creating practical and interesting tools that help developers and users enjoy a more agile and comfortable experience. Our projects cover various programming sectors and we do not have a thematic limitation in terms of projects.

[![More](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](https://github.com/pigeonposse)

***

<p align="center">

[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com?popup=about)
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/?popup=donate)
[![Github](https://img.shields.io/badge/Github-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pigeonposse)
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/pigeonposse_)
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/pigeon.posse/)
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@pigeonposse)

</p>

<!--

██████╗ ██╗ ██████╗ ███████╗ ██████╗ ███╗   ██╗██████╗  ██████╗ ███████╗███████╗███████╗
██╔══██╗██║██╔════╝ ██╔════╝██╔═══██╗████╗  ██║██╔══██╗██╔═══██╗██╔════╝██╔════╝██╔════╝
██████╔╝██║██║  ███╗█████╗  ██║   ██║██╔██╗ ██║██████╔╝██║   ██║███████╗███████╗█████╗
██╔═══╝ ██║██║   ██║██╔══╝  ██║   ██║██║╚██╗██║██╔═══╝ ██║   ██║╚════██║╚════██║██╔══╝
██║     ██║╚██████╔╝███████╗╚██████╔╝██║ ╚████║██║     ╚██████╔╝███████║███████║███████╗
╚═╝     ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝

█████╗█████╗█████╗█████╗█████╗█████╗█████╗
╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝

██████╗  ██████╗ ██╗   ██╗███████╗███╗   ██╗██╗   ██╗      ███╗   ███╗ ██████╗ ███╗   ██╗ ██████╗ ██████╗ ███████╗██████╗  ██████╗
██╔══██╗██╔═══██╗██║   ██║██╔════╝████╗  ██║██║   ██║      ████╗ ████║██╔═══██╗████╗  ██║██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔═══██╗
██║  ██║██║   ██║██║   ██║█████╗  ██╔██╗ ██║██║   ██║█████╗██╔████╔██║██║   ██║██╔██╗ ██║██║   ██║██████╔╝█████╗  ██████╔╝██║   ██║
██║  ██║██║   ██║╚██╗ ██╔╝██╔══╝  ██║╚██╗██║╚██╗ ██╔╝╚════╝██║╚██╔╝██║██║   ██║██║╚██╗██║██║   ██║██╔══██╗██╔══╝  ██╔═══╝ ██║   ██║
██████╔╝╚██████╔╝ ╚████╔╝ ███████╗██║ ╚████║ ╚████╔╝       ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║╚██████╔╝██║  ██║███████╗██║     ╚██████╔╝
╚═════╝  ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═══╝  ╚═══╝        ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝      ╚═════╝

-->
