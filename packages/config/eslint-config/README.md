# 🔥 Backan

<!-- PIGEONPOSSE START HEADER -->

[![HEADER](https://raw.githubusercontent.com/pigeonposse/backan/main/docs/public/banner.png)](https://backan.pigeonposse.com/)

[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com?popup=about)
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/?popup=donate)
[![Github](https://img.shields.io/badge/Github-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pigeonposse)
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/pigeonposse_)
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/pigeon.posse/)
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@pigeonposse)

[![License](https://img.shields.io/github/license/pigeonposse/backan?color=green&style=for-the-badge&logoColor=white)](/LICENSE)
[![Version](https://img.shields.io/npm/v/backan?color=blue&style=for-the-badge&label=Version)](https://www.npmjs.com/package/backan)

[**BACKAN**](https://backan.pigeonposse.com/) Create endpoints with type validations and OpenApi documentation, safely and quickly.

<!-- PIGEONPOSSE END HEADER -->

<!-- PIGEONPOSSE START DOCS -->
## Table of Contents

- [🔑 Installation](#-installation)
  - [Install only `core`](#install-only-core)
- [Setup](#setup)
- [Create `App` instace](#create-app-instace)
- [Create `Route`](#create-route)
- [Add `Endpoints`](#add-endpoints)
- [What is BACKAN?](#what-is-backan)
- [Project intention](#project-intention)
- [Contains](#contains)
- [Todo](#todo)

Start building your restAPI app now 🌈.

## 🔑 Installation

```bash [npm]
npm install backan
```

```bash [pnpm]
pnpm add backan
```

```bash [yarn]
yarn add backan
```

```bash [bun]
bun add backan
```

[![NPM Version](https://img.shields.io/npm/v/backan?style=for-the-badge&color=yellow)](https://www.npmjs.com/package/backan)

### Install only `core`

```bash [npm]
npm install @backan/core
```

```bash [pnpm]
pnpm add @backan/core
```

```bash [yarn]
yarn add @backan/core
```

```bash [bun]
bun add backan
```

[![NPM Version](https://img.shields.io/npm/v/%40backan%2Fcore?style=for-the-badge&color=yellow)](https://www.npmjs.com/package/@backan/core)

## Setup

You can automatically create a `backan` template with:

```bash [npm]
npm create backan
```

```bash [pnpm]
pnpm create backan
```

```bash [yarn]
yarn create backan
```

```bash [bun]
bun create backan
```

[Read more](https://backan.pigeonposse.com/guide/create/index)

## Create `App` instace

[Read more](https://backan.pigeonposse.com/guide/core/app)

## Create `Route`

[Read more](https://backan.pigeonposse.com/guide/core/route)

## Add `Endpoints`

- [GET](https://backan.pigeonposse.com/guide/core/get)
- [POST](https://backan.pigeonposse.com/guide/core/post)
- [STREAM](https://backan.pigeonposse.com/guide/core/stream)

## What is BACKAN?

![HEADER](https://backan.pigeonposse.com/banner.png)

**`BACKAN`** is a library designed to build **REST API** applications quickly and easily.

> [!IMPORTANT]
> Currently in phase `Beta`
> The library can be used perfectly in production, but could undergo changes and new features until version `1`.
> To avoid ongoing maintenance issues, we recommend installing a fixed version (without `^`) in your project.

## Project intention

Our project is not intended to be a substitute for any web framework. Our library aims to cover a specific use case, that of building APIs, simplifying this process as much as possible and creating APIs in a robust way.

The creation of this project is also due to the need of our [collective](htpps://pigeonposse.com) to create APIs with good documentation and in a simple way, an example of this is the Api section of [`bepp`](https://github.com/pigeonposse/bepp/tree/main/packages/api) (a web extension packager).

## Contains

- ✅ Simple `data validation`, so that your endpoints are as secure as possible and reduce repetitive code (boilerplate).
- ✅ Built-in and almost `automatic OpenAPI documentation`, improving the visibility of our API without the need to import other projects.

In addition, **BACKAN** also provides:

- A backan project creator with templates of greater and lesser complexity. [Read more](https://backan.pigeonposse.com/guide/core/index.md#setup)
- Configuration to create your [Node server](https://backan.pigeonposse.com/guide/server/index), perfect for running your application without having to configure anything. [Read more](https://backan.pigeonposse.com/guide/server/index)
- Tool to build the binary of your application, ideal for running the app without the need for a Node.js environment. [Read more](https://backan.pigeonposse.com/guide/builder/index)

> [!note]
> The documentation is under construction. Soon, we will write all the points it contains

## Todo

- 💡 Typing for make your frontend projects more easy.

[Read more](https://backan.pigeonposse.com/guide/todo/v1)

## What is `backan` built with?

Our library is built under the `hono` framework, which is why you will see references to it in our documentation and our code. **BACKAN** is an implementation that aims to simplify the construction of apirest for specific use cases.

You want to build an apirest quickly and safely and without thinking about third-party implementations, well here we propose our [alternative](https://backan.pigeonposse.com/guide/core/index).

## 🏁 Get started with `Backan`

Start building your restAPI app now 🌈.

[Read more](https://backan.pigeonposse.com/guide/core/index)

## 🗄️ Get started with `Backan` server

[Read more](https://backan.pigeonposse.com/guide/server/index)

## 📦 Build your project

The backan builder library allows you to build multiple things. Among others:

- [**`Executables / binaries`**](https://backan.pigeonposse.com/guide/builder/index.md#build-binaries): Create binaries of your project for all **systems** and **architectures** with zero config.
- [**`Client library`**](https://backan.pigeonposse.com/guide/builder/index.md#create-client): Create a client to facilitate the implementation of the API in a frontend or other service.
- [**`JSON schema file`**](https://backan.pigeonposse.com/guide/builder/index.md#build-json-types-schema): Export the **OpenAPI schema** to a **JSON file**.
- [**`TypeScript definitions file`**](https://backan.pigeonposse.com/guide/builder/index.md#build-json-types-schema): Export **OpenAPI schema** to a **d.ts file**.
- [**`Markdown documentation`**](https://backan.pigeonposse.com/guide/builder/index.md#build-markdown-documentation): Build your application documentation in a **Markdown file**.

[Read more](https://backan.pigeonposse.com/guide/builder/index)
<!-- PIGEONPOSSE END DOCS -->

<!-- PIGEONPOSSE START INDEX -->

## More from Backan

- [Documentation](https://backan.pigeonposse.com/)
  - 📚 [Library](https://backan.pigeonposse.com/guide/core)
  - 🏁 [Create (setup)]( https://backan.pigeonposse.com/guide/create )
  - 🗄️ [Server]( https://backan.pigeonposse.com/guide/server )
  - 📦 [Builder]( https://backan.pigeonposse.com/guide/builder )
- [Installation](https://backan.pigeonposse.com/guide/core/#installation)
<!-- PIGEONPOSSE END INDEX -->

<!-- PIGEONPOSSE START ORG -->
## 👨‍💻 Development

**BACKAN** is an open-source project and its development is open to anyone who wants to participate.

[![Issues](https://img.shields.io/badge/Issues-grey?style=for-the-badge)](https://github.com/pigeonposse/backan/issues)
[![Pull requests](https://img.shields.io/badge/Pulls-grey?style=for-the-badge)](https://github.com/pigeonposse/backan/pulls)
[![Read more](https://img.shields.io/badge/Read%20more-grey?style=for-the-badge)](https://backan.pigeonposse.com/)

## ☕ Donate

Help us to develop more interesting things.

[![Donate](https://img.shields.io/badge/Donate-grey?style=for-the-badge)](https://pigeonposse.com/?popup=donate)

## 📜 License

This software is licensed with **[GPL-3.0](/LICENSE)**.

[![Read more](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](/LICENSE)

## 🐦 About us

*PigeonPosse* is a ✨ **code development collective** ✨ focused on creating practical and interesting tools that help developers and users enjoy a more agile and comfortable experience. Our projects cover various programming sectors and we do not have a thematic limitation in terms of projects.

[![More](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](https://github.com/pigeonposse)

### Collaborators

|                                                                                    | Name        | Role         | GitHub                                         |
| ---------------------------------------------------------------------------------- | ----------- | ------------ | ---------------------------------------------- |
| <img src="https://github.com/angelespejo.png?size=72" alt="Angelo" style="border-radius:100%"/> | Angelo |   Author & Development   | [@Angelo](https://github.com/angelespejo) |
| <img src="https://github.com/PigeonPosse.png?size=72" alt="PigeonPosse" style="border-radius:100%"/> | PigeonPosse | Collective | [@PigeonPosse](https://github.com/PigeonPosse) |

<br>
<p align="center">

[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com?popup=about)
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/?popup=donate)
[![Github](https://img.shields.io/badge/Github-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pigeonposse)
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/pigeonposse_)
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/pigeon.posse/)
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@pigeonposse)

</p>
<!-- PIGEONPOSSE END ORG -->

<!-- PIGEONPOSSE START MARK -->
<!--
██████╗ ██╗ ██████╗ ███████╗ ██████╗ ███╗   ██╗
██╔══██╗██║██╔════╝ ██╔════╝██╔═══██╗████╗  ██║
██████╔╝██║██║  ███╗█████╗  ██║   ██║██╔██╗ ██║
██╔═══╝ ██║██║   ██║██╔══╝  ██║   ██║██║╚██╗██║
██║     ██║╚██████╔╝███████╗╚██████╔╝██║ ╚████║
╚═╝     ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝

██████╗  ██████╗ ███████╗███████╗███████╗
██╔══██╗██╔═══██╗██╔════╝██╔════╝██╔════╝
██████╔╝██║   ██║███████╗███████╗█████╗
██╔═══╝ ██║   ██║╚════██║╚════██║██╔══╝
██║     ╚██████╔╝███████║███████║███████╗
╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝

█████╗█████╗█████╗█████╗█████╗█████╗█████╗
╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝

██████╗  █████╗  ██████╗██╗  ██╗ █████╗ ███╗   ██╗
██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔══██╗████╗  ██║
██████╔╝███████║██║     █████╔╝ ███████║██╔██╗ ██║
██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══██║██║╚██╗██║
██████╔╝██║  ██║╚██████╗██║  ██╗██║  ██║██║ ╚████║
╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝

REPOSITORY: https://github.com/pigeonposse/backan
AUTHORS:
	- Angelo (https://github.com/angelespejo)

DEVELOPED BY Angelo 🐦🌈

-->
<!-- PIGEONPOSSE END MARK -->
