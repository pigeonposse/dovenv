# `@dovenv/repo` - API documentation

## Classes

### Contributors\<R\>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `R` *extends* `RoleMap` | [`Role`](#role-1) |

#### Constructors

##### new Contributors()

```ts
new Contributors<R>(config?: ContributorsParams<R>): Contributors<R>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `config`? | `ContributorsParams`\<`R`\> |

###### Returns

[`Contributors`](#contributorsr)\<`R`\>

#### Methods

##### filterByRole()

```ts
filterByRole(role: RoleKey[]): Promise<undefined | ContributorsOpts>
```

Filter the contributors by role using a list of role IDs.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `role` | `RoleKey`[] | Role IDs to filter by. |

###### Returns

`Promise`\<`undefined` \| `ContributorsOpts`\>

- The filtered contributors.

##### filterByRolePattern()

```ts
filterByRolePattern(pattern: string[]): Promise<undefined | ContributorsOpts>
```

Filter the contributors by role using a pattern.

Uses the `getMatch` utility to filter the role IDs using the provided pattern.
The filtered role IDs are then passed to the `filterByRole` method.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pattern` | `string`[] | Pattern to filter the role IDs with. |

###### Returns

`Promise`\<`undefined` \| `ContributorsOpts`\>

- The filtered contributors.

##### getHtmlContent()

```ts
getHtmlContent(opts?: ContributorsGetOpts): Promise<string>
```

Retrieves the HTML content of a table containing the contributors.

Optionally takes an object with the same shape as the class constructor options.
If the `role` or `member` properties are not provided, they default to the class constructor options.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `ContributorsGetOpts` | Options object. |

###### Returns

`Promise`\<`string`\>

- The HTML content of the contributors table.

##### getMarkdownContent()

```ts
getMarkdownContent(opts?: ContributorsGetOpts): Promise<string>
```

Converts the HTML content of the contributors table to Markdown.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `ContributorsGetOpts` | Options object. |

###### Returns

`Promise`\<`string`\>

- The Markdown content of the contributors table.

##### getTerminalContent()

```ts
getTerminalContent(opts?: ContributorsGetOpts): Promise<string>
```

Retrieves the contributors table content formatted for the terminal.

Optionally takes an object with the same shape as the class constructor options.
If the `role` or `member` properties are not provided, they default to the class constructor options.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `ContributorsGetOpts` | Options object. |

###### Returns

`Promise`\<`string`\>

- The terminal-formatted content of the contributors table.

##### showTerminalOutput()

```ts
showTerminalOutput(opts?: ContributorsGetOpts): Promise<void>
```

Logs the contributors table as a formatted string to the terminal.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `ContributorsGetOpts` | Options object. |

###### Returns

`Promise`\<`void`\>

- The result of logging the contributors table.

#### Properties

| Property | Type |
| ------ | ------ |
| `opts` | `undefined` \| `ContributorsOpts` |

***

### Git

#### Extends

- `Repo`\<[`GitConfig`](#gitconfig)\>

#### Constructors

##### new Git()

```ts
new Git(data: {
  opts: GitConfig;
  utils: CommandSuper;
 }): Git
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `object` |
| `data.opts`? | [`GitConfig`](#gitconfig) |
| `data.utils` | `CommandSuper` |

###### Returns

[`Git`](#git)

###### Overrides

`Repo<GitConfig>.constructor`

#### Methods

##### init()

```ts
init(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`Repo.init`

##### initGH()

```ts
initGH(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`Repo.initGH`

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| `add` | [`GitAdd`](#gitadd) | - |
| `branch` | [`GitBranch`](#gitbranch) | - |
| `commit` | [`GitCommit`](#gitcommit) | - |
| `husky` | [`Husky`](#husky) | - |
| `initialize` | [`GitInit`](#gitinit) | - |
| `opts` | `undefined` \| [`GitConfig`](#gitconfig) | `Repo.opts` |
| `pull` | [`GitPull`](#gitpull) | - |
| `push` | [`GitPush`](#gitpush) | - |

***

### GitAdd

#### Extends

- `GitSuper`

#### Constructors

##### new GitAdd()

```ts
new GitAdd(__namedParameters: {
  opts: GitConfig;
  utils: CommandSuper;
 }): GitAdd
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`GitConfig`](#gitconfig) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`GitAdd`](#gitadd)

###### Inherited from

`GitSuper.constructor`

#### Methods

##### ask()

```ts
ask(initialValue: string): Promise<string>
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `initialValue` | `string` | `'.'` |

###### Returns

`Promise`\<`string`\>

##### exec()

```ts
exec(value: string): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

###### Returns

`Promise`\<`void`\>

##### getGitRemoteURL()

```ts
getGitRemoteURL(): Promise<undefined | string>
```

###### Returns

`Promise`\<`undefined` \| `string`\>

###### Inherited from

`GitSuper.getGitRemoteURL`

##### init()

```ts
init(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.init`

##### initGH()

```ts
initGH(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.initGH`

##### run()

```ts
run(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| `opts` | `undefined` \| [`GitConfig`](#gitconfig) | `GitSuper.opts` |

***

### GitBranch

#### Extends

- `GitSuper`

#### Constructors

##### new GitBranch()

```ts
new GitBranch(__namedParameters: {
  opts: GitConfig;
  utils: CommandSuper;
 }): GitBranch
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`GitConfig`](#gitconfig) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`GitBranch`](#gitbranch)

###### Inherited from

`GitSuper.constructor`

#### Methods

##### askSelectBranch()

```ts
askSelectBranch(defaultValue?: string, remote?: boolean): Promise<string>
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `defaultValue`? | `string` | `undefined` |
| `remote`? | `boolean` | `true` |

###### Returns

`Promise`\<`string`\>

##### change()

```ts
change(branchName?: string, force?: boolean): Promise<void>
```

Change to a specified branch.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `branchName`? | `string` | `undefined` | The name of the branch to switch to. |
| `force`? | `boolean` | `false` | If true, force switches to the branch, discarding local changes. |

###### Returns

`Promise`\<`void`\>

##### create()

```ts
create(branchName?: string): Promise<void>
```

Create a new branch without switching to it.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `branchName`? | `string` | The name of the branch to create. |

###### Returns

`Promise`\<`void`\>

##### createAndSwitch()

```ts
createAndSwitch(branchName?: string): Promise<void>
```

Create a new branch and switch to it.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `branchName`? | `string` | The name of the branch to create and switch to. |

###### Returns

`Promise`\<`void`\>

##### delete()

```ts
delete(branchName?: string, force?: boolean): Promise<void>
```

Delete a branch.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `branchName`? | `string` | `undefined` | The name of the branch to delete. |
| `force`? | `boolean` | `false` | If true, forces deletion of the branch. |

###### Returns

`Promise`\<`void`\>

##### getAll()

```ts
getAll(remote: boolean): Promise<string[]>
```

Get all branches in the repository.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `remote` | `boolean` | `true` | If true, shows remote branches as well. |

###### Returns

`Promise`\<`string`[]\>

- An array of branch names.

##### getCurrent()

```ts
getCurrent(): Promise<string>
```

Get the current branch name.

###### Returns

`Promise`\<`string`\>

- The name of the current branch.

##### getGitRemoteURL()

```ts
getGitRemoteURL(): Promise<undefined | string>
```

###### Returns

`Promise`\<`undefined` \| `string`\>

###### Inherited from

`GitSuper.getGitRemoteURL`

##### init()

```ts
init(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.init`

##### initGH()

```ts
initGH(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.initGH`

##### showAll()

```ts
showAll(remote: boolean): Promise<void>
```

Show all branches in the repository.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `remote` | `boolean` | `true` | If true, shows remote branches as well. |

###### Returns

`Promise`\<`void`\>

##### showCurrent()

```ts
showCurrent(): Promise<void>
```

Shows the current branch name.

###### Returns

`Promise`\<`void`\>

##### switch()

```ts
switch(branchName?: string): Promise<void>
```

Switch to an existing branch.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `branchName`? | `string` | The name of the branch to switch to. |

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| `opts` | `undefined` \| [`GitConfig`](#gitconfig) | `GitSuper.opts` |

***

### GitCommit

#### Extends

- `GitSuper`

#### Constructors

##### new GitCommit()

```ts
new GitCommit(__namedParameters: {
  opts: GitConfig;
  utils: CommandSuper;
 }): GitCommit
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`GitConfig`](#gitconfig) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`GitCommit`](#gitcommit)

###### Inherited from

`GitSuper.constructor`

#### Methods

##### ask()

```ts
ask(execute: boolean): Promise<string>
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `execute` | `boolean` | `true` |

###### Returns

`Promise`\<`string`\>

##### exec()

```ts
exec(message: string): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

###### Returns

`Promise`\<`void`\>

##### getGitRemoteURL()

```ts
getGitRemoteURL(): Promise<undefined | string>
```

###### Returns

`Promise`\<`undefined` \| `string`\>

###### Inherited from

`GitSuper.getGitRemoteURL`

##### getLastCommit()

```ts
getLastCommit(): Promise<string>
```

Get the last commit message.

###### Returns

`Promise`\<`string`\>

The last commit message.

##### getStagedFiles()

```ts
getStagedFiles(): Promise<string>
```

###### Returns

`Promise`\<`string`\>

##### getStagedFilesList()

```ts
getStagedFilesList(): Promise<string[]>
```

Get list of staged files.

###### Returns

`Promise`\<`string`[]\>

List of staged files.

##### init()

```ts
init(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.init`

##### initGH()

```ts
initGH(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.initGH`

##### isStageEmpty()

```ts
isStageEmpty(): Promise<boolean>
```

###### Returns

`Promise`\<`boolean`\>

##### run()

```ts
run(): Promise<undefined | string>
```

###### Returns

`Promise`\<`undefined` \| `string`\>

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| `opts` | `undefined` \| [`GitConfig`](#gitconfig) | `GitSuper.opts` |
| `scopes` | `undefined` \| \{ `desc`: `string`; `title`: `string`; `value`: `string`; \}[] | - |
| `types` | `undefined` \| \{ `desc`: `string`; `title`: `string`; `value`: `string`; \}[] | - |

***

### GitHub

#### Constructors

##### new GitHub()

```ts
new GitHub(__namedParameters: {
  opts: GitHubConfig;
  utils: CommandSuper;
 }): GitHub
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`GitHubConfig`](#githubconfig) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`GitHub`](#github)

#### Methods

##### download()

```ts
download(input: string, output: string): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | `string` |
| `output` | `string` |

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type |
| ------ | ------ |
| `create` | `GitHubCreate` |
| `info` | [`GitHubInfo`](#githubinfo) |
| `opts` | `undefined` \| [`GitHubConfig`](#githubconfig) |
| `workflow` | [`GitHubWorkflow`](#githubworkflow) |

***

### GitHubInfo

#### Extends

- `GHSuper`

#### Constructors

##### new GitHubInfo()

```ts
new GitHubInfo(__namedParameters: {
  opts: GitHubConfig;
  utils: CommandSuper;
 }): GitHubInfo
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`GitHubConfig`](#githubconfig) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`GitHubInfo`](#githubinfo)

###### Inherited from

`GHSuper.constructor`

#### Methods

##### getRepoList()

```ts
getRepoList(opts?: {
  archived: boolean;
  fork: boolean;
  visibility: "public" | "private" | "internal";
 }): Promise<{
  desc: undefined | string;
  homepage: undefined | string;
  name: r.name;
  owner: r.owner.login;
  topics: undefined | string[];
  url: r.url;
}[]>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | `object` |
| `opts.archived`? | `boolean` |
| `opts.fork`? | `boolean` |
| `opts.visibility`? | `"public"` \| `"private"` \| `"internal"` |

###### Returns

`Promise`\<\{
  `desc`: `undefined` \| `string`;
  `homepage`: `undefined` \| `string`;
  `name`: `r.name`;
  `owner`: `r.owner.login`;
  `topics`: `undefined` \| `string`[];
  `url`: `r.url`;
 \}[]\>

###### Inherited from

`GHSuper.getRepoList`

##### init()

```ts
init(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GHSuper.init`

##### initGH()

```ts
initGH(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GHSuper.initGH`

##### update()

```ts
update(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### view()

```ts
view(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### viewAll()

```ts
viewAll(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| `opts` | `undefined` \| [`GitHubConfig`](#githubconfig) | `GHSuper.opts` |

***

### GitHubWorkflow

#### Extends

- `GHSuper`

#### Constructors

##### new GitHubWorkflow()

```ts
new GitHubWorkflow(__namedParameters: {
  opts: GitHubConfig;
  utils: CommandSuper;
 }): GitHubWorkflow
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`GitHubConfig`](#githubconfig) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`GitHubWorkflow`](#githubworkflow)

###### Inherited from

`GHSuper.constructor`

#### Methods

##### getRepoList()

```ts
getRepoList(opts?: {
  archived: boolean;
  fork: boolean;
  visibility: "public" | "private" | "internal";
 }): Promise<{
  desc: undefined | string;
  homepage: undefined | string;
  name: r.name;
  owner: r.owner.login;
  topics: undefined | string[];
  url: r.url;
}[]>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | `object` |
| `opts.archived`? | `boolean` |
| `opts.fork`? | `boolean` |
| `opts.visibility`? | `"public"` \| `"private"` \| `"internal"` |

###### Returns

`Promise`\<\{
  `desc`: `undefined` \| `string`;
  `homepage`: `undefined` \| `string`;
  `name`: `r.name`;
  `owner`: `r.owner.login`;
  `topics`: `undefined` \| `string`[];
  `url`: `r.url`;
 \}[]\>

###### Inherited from

`GHSuper.getRepoList`

##### init()

```ts
init(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GHSuper.init`

##### initGH()

```ts
initGH(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GHSuper.initGH`

##### list()

```ts
list(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### run()

```ts
run(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| `opts` | `undefined` \| [`GitHubConfig`](#githubconfig) | `GHSuper.opts` |

***

### GitInit

#### Extends

- `GitSuper`

#### Constructors

##### new GitInit()

```ts
new GitInit(__namedParameters: {
  opts: GitConfig;
  utils: CommandSuper;
 }): GitInit
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`GitConfig`](#gitconfig) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`GitInit`](#gitinit)

###### Inherited from

`GitSuper.constructor`

#### Methods

##### getGitRemoteURL()

```ts
getGitRemoteURL(): Promise<undefined | string>
```

###### Returns

`Promise`\<`undefined` \| `string`\>

###### Inherited from

`GitSuper.getGitRemoteURL`

##### init()

```ts
init(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.init`

##### initGH()

```ts
initGH(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.initGH`

##### isInit()

```ts
isInit(): Promise<boolean>
```

###### Returns

`Promise`\<`boolean`\>

##### run()

```ts
run(silent: boolean): Promise<void>
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `silent` | `boolean` | `false` |

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| `opts` | `undefined` \| [`GitConfig`](#gitconfig) | `GitSuper.opts` |

***

### GitPull

#### Extends

- `GitSuper`

#### Constructors

##### new GitPull()

```ts
new GitPull(__namedParameters: {
  opts: GitConfig;
  utils: CommandSuper;
 }): GitPull
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`GitConfig`](#gitconfig) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`GitPull`](#gitpull)

###### Inherited from

`GitSuper.constructor`

#### Methods

##### getGitRemoteURL()

```ts
getGitRemoteURL(): Promise<undefined | string>
```

###### Returns

`Promise`\<`undefined` \| `string`\>

###### Inherited from

`GitSuper.getGitRemoteURL`

##### init()

```ts
init(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.init`

##### initGH()

```ts
initGH(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.initGH`

##### run()

```ts
run(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| `opts` | `undefined` \| [`GitConfig`](#gitconfig) | `GitSuper.opts` |

***

### GitPush

#### Extends

- `GitSuper`

#### Constructors

##### new GitPush()

```ts
new GitPush(__namedParameters: {
  opts: GitConfig;
  utils: CommandSuper;
 }): GitPush
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`GitConfig`](#gitconfig) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`GitPush`](#gitpush)

###### Inherited from

`GitSuper.constructor`

#### Methods

##### exec()

```ts
exec(branch: string): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `branch` | `string` |

###### Returns

`Promise`\<`void`\>

##### getGitRemoteURL()

```ts
getGitRemoteURL(): Promise<undefined | string>
```

###### Returns

`Promise`\<`undefined` \| `string`\>

###### Inherited from

`GitSuper.getGitRemoteURL`

##### init()

```ts
init(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.init`

##### initGH()

```ts
initGH(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.initGH`

##### run()

```ts
run(opts?: {
  skipUpdate: boolean;
  skipWorkflow: boolean;
}): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | `object` |
| `opts.skipUpdate`? | `boolean` |
| `opts.skipWorkflow`? | `boolean` |

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| `opts` | `undefined` \| [`GitConfig`](#gitconfig) | `GitSuper.opts` |

***

### Husky

#### Extends

- `GitSuper`

#### Constructors

##### new Husky()

```ts
new Husky(__namedParameters: {
  opts: GitConfig;
  utils: CommandSuper;
 }): Husky
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`GitConfig`](#gitconfig) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`Husky`](#husky)

###### Inherited from

`GitSuper.constructor`

#### Methods

##### getGitRemoteURL()

```ts
getGitRemoteURL(): Promise<undefined | string>
```

###### Returns

`Promise`\<`undefined` \| `string`\>

###### Inherited from

`GitSuper.getGitRemoteURL`

##### init()

```ts
init(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.init`

##### initGH()

```ts
initGH(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`GitSuper.initGH`

##### run()

```ts
run(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| `opts` | `undefined` \| [`GitConfig`](#gitconfig) | `GitSuper.opts` |

***

### Packages

#### Extends

- `Repo`

#### Constructors

##### new Packages()

```ts
new Packages(__namedParameters: {
  opts: GitHubConfig;
  utils: CommandSuper;
 }): Packages
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.opts`? | [`GitHubConfig`](#githubconfig) |
| `__namedParameters.utils` | `CommandSuper` |

###### Returns

[`Packages`](#packages)

###### Inherited from

`Repo.constructor`

#### Methods

##### ask()

```ts
ask(): Promise<{}>
```

###### Returns

`Promise`\<\{\}\>

##### getPkgVersion()

```ts
getPkgVersion(npm: boolean, showPrivate: boolean): Promise<{
  name: pkg.name;
  npm: npmVersion;
  private: pkgPrivate;
  version: pkg.version;
}[]>
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `npm` | `boolean` | `true` |
| `showPrivate` | `boolean` | `true` |

###### Returns

`Promise`\<\{
  `name`: `pkg.name`;
  `npm`: `npmVersion`;
  `private`: `pkgPrivate`;
  `version`: `pkg.version`;
 \}[]\>

##### getSize()

```ts
getSize(name: string): Promise<{
  data: SiziumResponse;
  inputType: pkg.inputType;
}>
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `name` | `string` | `'./'` |

###### Returns

`Promise`\<\{
  `data`: `SiziumResponse`;
  `inputType`: `pkg.inputType`;
 \}\>

| Name | Type | Default value |
| ------ | ------ | ------ |
| `data` | `SiziumResponse` | - |
| `inputType` | `"string"` \| `"url"` \| `"json"` \| `"path"` | pkg.inputType |

##### getSizeData()

```ts
getSizeData(name: string): Promise<{
  data: SiziumResponse;
  inputType: pkg.inputType;
}>
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `name` | `string` | `'./'` |

###### Returns

`Promise`\<\{
  `data`: `SiziumResponse`;
  `inputType`: `pkg.inputType`;
 \}\>

| Name | Type | Default value |
| ------ | ------ | ------ |
| `data` | `SiziumResponse` | - |
| `inputType` | `"string"` \| `"url"` \| `"json"` \| `"path"` | pkg.inputType |

##### init()

```ts
init(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Overrides

`Repo.init`

##### initGH()

```ts
initGH(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

###### Inherited from

`Repo.initGH`

##### prepare()

```ts
prepare(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### publish()

```ts
publish(preCmd?: string): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `preCmd`? | `string` |

###### Returns

`Promise`\<`void`\>

##### release()

```ts
release(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

##### showPackageVersion()

```ts
showPackageVersion(npm: boolean): Promise<void>
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `npm` | `boolean` | `true` |

###### Returns

`Promise`\<`void`\>

##### version()

```ts
version(): Promise<void>
```

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| `opts` | `undefined` \| [`GitHubConfig`](#githubconfig) | `Repo.opts` |

## Functions

### contributorsPlugin()

```ts
function contributorsPlugin<R>(conf?: ContributorsConfig<R>): Config
```

Dovenv plugin for managing workspace contributors.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `R` *extends* `RoleMap` | `RoleMap` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `conf`? | [`ContributorsConfig`](#contributorsconfigr)\<`R`\> | Optional configuration. |

#### Returns

`Config`

- The plugin configuration.

***

### ghPlugin()

```ts
function ghPlugin(conf?: GitHubConfig): Config
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `conf`? | [`GitHubConfig`](#githubconfig) |

#### Returns

`Config`

***

### gitPlugin()

```ts
function gitPlugin(conf?: GitConfig): Config
```

Dovenv plugin for managing a repository.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `conf`? | [`GitConfig`](#gitconfig) | Optional configuration. |

#### Returns

`Config`

- The plugin configuration.

#### Example

```ts
import { defineConfig } from '@dovenv/core'
import { gitPlugin } from '@dovenv/plugin/repo'

export default defineConfig( [
  gitPlugin( {
    commit : {
      types : [
        { value: 'feat', title: 'A new feature' },
        { value: 'fix', title: 'A bug fix' },
      ],
      scopes : [
        { value: 'core', title: 'Core' },
        { value: 'package', title: 'Package' },
        { value: 'env', title: 'Environment' },
        { value: 'all', title: 'All' },
      ],
    },
  } ),
] )
```

***

### package2Contributors()

```ts
function package2Contributors(pkg: {
  devEngines: {
     cpu: undefined | {
        name: string;
        onFail: "error" | "ignore" | "warn";
        version: string;
       };
     libc: undefined | {
        name: string;
        onFail: "error" | "ignore" | "warn";
        version: string;
       };
     os: undefined | {
        name: string;
        onFail: "error" | "ignore" | "warn";
        version: string;
       };
     packageManager: undefined | {
        name: string;
        onFail: "error" | "ignore" | "warn";
        version: string;
       };
     runtime: undefined | {
        name: string;
        onFail: "error" | "ignore" | "warn";
        version: string;
       };
    };
 }, opts?: ContributorsOpts): undefined | ContributorsOpts
```

Converts a package's author, contributors, and maintainers information into
a structured format of contributors and their roles.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pkg` | `object` | The package JSON containing author, contributors, and maintainers data. |
| `pkg.devEngines`? | `object` | The devEngines field aids engineers working on a codebase to all be using the same tooling. **See** https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines |
| `pkg.devEngines.cpu`? | `undefined` \| \{ `name`: `string`; `onFail`: `"error"` \| `"ignore"` \| `"warn"`; `version`: `string`; \} | - |
| `pkg.devEngines.libc`? | `undefined` \| \{ `name`: `string`; `onFail`: `"error"` \| `"ignore"` \| `"warn"`; `version`: `string`; \} | - |
| `pkg.devEngines.os`? | `undefined` \| \{ `name`: `string`; `onFail`: `"error"` \| `"ignore"` \| `"warn"`; `version`: `string`; \} | - |
| `pkg.devEngines.packageManager`? | `undefined` \| \{ `name`: `string`; `onFail`: `"error"` \| `"ignore"` \| `"warn"`; `version`: `string`; \} | - |
| `pkg.devEngines.runtime`? | `undefined` \| \{ `name`: `string`; `onFail`: `"error"` \| `"ignore"` \| `"warn"`; `version`: `string`; \} | - |
| `opts`? | `ContributorsOpts` | Optional contributors options. |

#### Returns

`undefined` \| `ContributorsOpts`

An object containing:
                                   - `role`: An object defining various contributor roles with their names and emojis.
                                   - `member`: An array of contributors with details like role, GitHub username, name, and URL.

***

### pkgPlugin()

```ts
function pkgPlugin(conf?: GitHubConfig): Config
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `conf`? | [`GitHubConfig`](#githubconfig) |

#### Returns

`Config`

***

### repoPlugin()

```ts
function repoPlugin<R>(opts?: Config<R>): Config
```

Dovenv plugin for managing a repository.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `R` *extends* `RoleMap` | `RoleMap` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | [`Config`](#configr)\<`R`\> | Optional configuration. |

#### Returns

`Config`

- The plugin configuration.

## Type Aliases

### Config\<R\>

```ts
type Config<R>: GitHubConfig & GitConfig & {
  contributors: ContributorsConfig<R>;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `contributors`? | [`ContributorsConfig`](#contributorsconfigr)\<`R`\> | Contributors configuration |

#### Type Parameters

| Type Parameter |
| ------ |
| `R` *extends* [`Role`](#role-1) |

***

### ContributorsConfig\<R\>

```ts
type ContributorsConfig<R>: {
  member: Members<keyof R>;
  role: R;
};
```

#### Type Parameters

| Type Parameter |
| ------ |
| `R` *extends* [`Role`](#role-1) |

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `member` | [`Members`](#membersid)\<keyof `R`\> | Set contributor members. **Example** `[ { ghUsername: 'angelespejo', name: 'Angelo', role: 'author' }, { ghUsername: 'pigeonposse', name: 'PigeonPosse', role: 'organization' }, ]` |
| `role` | `R` | Set contributor roles. **Example** `{ 	 * owner: { name: 'Owner', emoji: '👑' }, 	 * developer: { name: 'Developer', emoji: '🤝' }, 	 * organization: { name: 'Organization', emoji: '🏢' }, 	 * sponsor: { name: 'Sponsor', emoji: '🤝' }, 	 * translator: { name: 'Translator', emoji: '🌏' } 	 * },` |

***

### GitConfig

```ts
type GitConfig: GitHubConfig & {
  commit: {
     scopes: {
        desc: string;
        title: string;
        value: string;
       }[];
     types: {
        desc: string;
        title: string;
        value: string;
       }[];
    };
  husky: {
     path: string;
    };
  pull: unknown;
  push: unknown;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `commit`? | \{ `scopes`: \{ `desc`: `string`; `title`: `string`; `value`: `string`; \}[]; `types`: \{ `desc`: `string`; `title`: `string`; `value`: `string`; \}[]; \} | Commit configuration |
| `commit.scopes`? | \{ `desc`: `string`; `title`: `string`; `value`: `string`; \}[] | Scope of commit message. **Example** `[ 	{value: 'core'}, 	{value: 'package'}, 	{value: 'env'}, 	{value: 'all'} ]` |
| `commit.types`? | \{ `desc`: `string`; `title`: `string`; `value`: `string`; \}[] | Type of commit message. Add types for your commits. **Example** `[ {value: 'feat', title: 'A new feature'}, {value: 'fix', title: 'A bug fix'} ]` |
| `husky`? | \{ `path`: `string`; \} | Husky configuration **Link** https://typicode.github.io/husky/ |
| `husky.path` | `string` | The path to set the '.husky' directory. **Default** `'.dovenv/.husky'` |
| `pull`? | `unknown` | Pull configuration |
| `push`? | `unknown` | Push configuration |

***

### GitHubConfig

```ts
type GitHubConfig: {
  defaultBranch: string;
  desc: string;
  homepageURL: string;
  ID: string;
  tags: string[];
  URL: string;
  userID: string;
  workflowDefaultInputs: string;
  workflowsDir: string;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `defaultBranch`? | `string` | Primary branch from the repository. **Example** `"main"` |
| `desc`? | `string` | Description of the repository. **Example** `"This is a cool project"` |
| `homepageURL`? | `string` | The URL of the project's homepage. **Example** `"https://pigeonposse.com"` |
| `ID`? | `string` | Name of the repository. **Example** `"dovenv"` |
| `tags`? | `string`[] | Tags or topics associated with the repository. **Example** `[ "web", "api", "rest-api", "openapi", "library", "node", "js"]` |
| `URL`? | `string` | URL of the repopository. **Example** `"https://github.com/pigeonposse/dovenv"` |
| `userID`? | `string` | GitHub user|org ID. |
| `workflowDefaultInputs`? | `string` | Workflow default inputs. |
| `workflowsDir`? | `string` | Path to .github/workflows directory. |

***

### Members\<ID\>

```ts
type Members<ID>: {
  avatar: string;
  ghUsername: string;
  name: string;
  role: ID;
  url: string;
 }[];
```

#### Type Parameters

| Type Parameter |
| ------ |
| `ID` *extends* `RoleKey` |

***

### Role

```ts
type Role: RoleMap;
```

## References

### default

Renames and re-exports [repoPlugin](#repoplugin)

### PackageConfig

Renames and re-exports [GitHubConfig](#githubconfig)

## Variables

### CONTRIBUTOR\_ROLE

```ts
const CONTRIBUTOR_ROLE: {
  author: {
     desc: 'Author of the project.';
     emoji: '👑';
     name: 'Author';
    };
  contributor: {
     desc: 'Contributor for the development of the project. Code, docs, etc.';
     emoji: '💻';
     name: 'Contributor';
    };
  designer: {
     desc: 'Contributor for the design of the project. Images, icons, etc.';
     emoji: '💄';
     name: 'Designer';
    };
  developer: {
     desc: 'Contributor for the development of the project. Code, docs, etc.';
     emoji: '💻';
     name: 'Developer';
    };
  mantainer: {
     desc: 'Maintainer of the project. Code, docs, etc.';
     emoji: '🚧';
     name: 'Mantainer';
    };
  organization: {
     desc: 'Organization of the project.';
     emoji: '🏢';
     name: 'Organization';
    };
  sponsor: {
     desc: 'Sponsor of the project.';
     emoji: '🤝';
     name: 'Sponsor';
    };
  translator: {
     desc: 'Translator for the project.';
     emoji: '🌏';
     name: 'Translator';
    };
};
```

Contributor roles object with their names and emojis.

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `author` | \{ `desc`: `'Author of the project.'`; `emoji`: `'👑'`; `name`: `'Author'`; \} | - |
| `author.desc` | `"Author of the project."` | 'Author of the project.' |
| `author.emoji` | `"👑"` | '👑' |
| `author.name` | `"Author"` | 'Author' |
| `contributor` | \{ `desc`: `'Contributor for the development of the project. Code, docs, etc.'`; `emoji`: `'💻'`; `name`: `'Contributor'`; \} | - |
| `contributor.desc` | `"Contributor for the development of the project. Code, docs, etc."` | 'Contributor for the development of the project. Code, docs, etc.' |
| `contributor.emoji` | `"💻"` | '💻' |
| `contributor.name` | `"Contributor"` | 'Contributor' |
| `designer` | \{ `desc`: `'Contributor for the design of the project. Images, icons, etc.'`; `emoji`: `'💄'`; `name`: `'Designer'`; \} | - |
| `designer.desc` | `"Contributor for the design of the project. Images, icons, etc."` | 'Contributor for the design of the project. Images, icons, etc.' |
| `designer.emoji` | `"💄"` | '💄' |
| `designer.name` | `"Designer"` | 'Designer' |
| `developer` | \{ `desc`: `'Contributor for the development of the project. Code, docs, etc.'`; `emoji`: `'💻'`; `name`: `'Developer'`; \} | - |
| `developer.desc` | `"Contributor for the development of the project. Code, docs, etc."` | 'Contributor for the development of the project. Code, docs, etc.' |
| `developer.emoji` | `"💻"` | '💻' |
| `developer.name` | `"Developer"` | 'Developer' |
| `mantainer` | \{ `desc`: `'Maintainer of the project. Code, docs, etc.'`; `emoji`: `'🚧'`; `name`: `'Mantainer'`; \} | - |
| `mantainer.desc` | `"Maintainer of the project. Code, docs, etc."` | 'Maintainer of the project. Code, docs, etc.' |
| `mantainer.emoji` | `"🚧"` | '🚧' |
| `mantainer.name` | `"Mantainer"` | 'Mantainer' |
| `organization` | \{ `desc`: `'Organization of the project.'`; `emoji`: `'🏢'`; `name`: `'Organization'`; \} | - |
| `organization.desc` | `"Organization of the project."` | 'Organization of the project.' |
| `organization.emoji` | `"🏢"` | '🏢' |
| `organization.name` | `"Organization"` | 'Organization' |
| `sponsor` | \{ `desc`: `'Sponsor of the project.'`; `emoji`: `'🤝'`; `name`: `'Sponsor'`; \} | - |
| `sponsor.desc` | `"Sponsor of the project."` | 'Sponsor of the project.' |
| `sponsor.emoji` | `"🤝"` | '🤝' |
| `sponsor.name` | `"Sponsor"` | 'Sponsor' |
| `translator` | \{ `desc`: `'Translator for the project.'`; `emoji`: `'🌏'`; `name`: `'Translator'`; \} | - |
| `translator.desc` | `"Translator for the project."` | 'Translator for the project.' |
| `translator.emoji` | `"🌏"` | '🌏' |
| `translator.name` | `"Translator"` | 'Translator' |
