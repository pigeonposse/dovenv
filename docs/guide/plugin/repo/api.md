# `@dovenv/repo` - API documentation

## Classes

### Contributors\<ID, R\>

#### Type Parameters

| Type Parameter |
| ------ |
| `ID` *extends* `string` |
| `R` *extends* `Role`\<`ID`\> |

#### Constructors

##### new Contributors()

```ts
new Contributors<ID, R>(opts?: {
  member: Contributor<Extract<keyof R, string>>[];
  role: R;
}): Contributors<ID, R>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | `object` |
| `opts.member`? | `Contributor`\<`Extract`\<keyof `R`, `string`\>\>[] |
| `opts.role`? | `R` |

###### Returns

[`Contributors`](#contributorsid-r)\<`ID`, `R`\>

#### Methods

##### filterByRole()

```ts
filterByRole(role: keyof ID[]): Promise<undefined | {
  member: Contributor<Extract<keyof R, string>>[];
  role: R;
}>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `role` | keyof `ID`[] |

###### Returns

`Promise`\<`undefined` \| \{
  `member`: `Contributor`\<`Extract`\<keyof `R`, `string`\>\>[];
  `role`: `R`;
 \}\>

##### filterByRolePattern()

```ts
filterByRolePattern(pattern: string[]): Promise<undefined | {
  member: Contributor<Extract<keyof R, string>>[];
  role: R;
}>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern` | `string`[] |

###### Returns

`Promise`\<`undefined` \| \{
  `member`: `Contributor`\<`Extract`\<keyof `R`, `string`\>\>[];
  `role`: `R`;
 \}\>

##### getHtmlContent()

```ts
getHtmlContent(opts?: {
  member: Contributor<Extract<keyof R, string>>[];
  role: R;
}): Promise<string>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | `object` |
| `opts.member`? | `Contributor`\<`Extract`\<keyof `R`, `string`\>\>[] |
| `opts.role`? | `R` |

###### Returns

`Promise`\<`string`\>

##### getMembers()

```ts
getMembers(): Promise<Contributor<Extract<keyof R, string>>[]>
```

###### Returns

`Promise`\<`Contributor`\<`Extract`\<keyof `R`, `string`\>\>[]\>

##### getRoles()

```ts
getRoles(): Promise<R>
```

###### Returns

`Promise`\<`R`\>

##### showTerminalOutput()

```ts
showTerminalOutput(opts?: {
  member: Contributor<Extract<keyof R, string>>[];
  role: R;
}): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts`? | `object` |
| `opts.member`? | `Contributor`\<`Extract`\<keyof `R`, `string`\>\>[] |
| `opts.role`? | `R` |

###### Returns

`Promise`\<`void`\>

#### Properties

| Property | Type |
| ------ | ------ |
| `opts` | \{ `member`: `Contributor`\<`Extract`\<keyof `R`, `string`\>\>[]; `role`: `R`; \} |
| `opts.member` | `Contributor`\<`Extract`\<keyof `R`, `string`\>\>[] |
| `opts.role` | `R` |

***

### Git

#### Extends

- `Repo`\<`GitConfig`\>

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
| `data.opts`? | `GitConfig` |
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
| `opts` | `undefined` \| `GitConfig` | `Repo.opts` |
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
| `__namedParameters.opts`? | `GitConfig` |
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
| `opts` | `undefined` \| `GitConfig` | `GitSuper.opts` |

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
| `__namedParameters.opts`? | `GitConfig` |
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
| `opts` | `undefined` \| `GitConfig` | `GitSuper.opts` |

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
| `__namedParameters.opts`? | `GitConfig` |
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
| `opts` | `undefined` \| `GitConfig` | `GitSuper.opts` |
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
  visibility: "private" | "public" | "internal";
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
| `opts.visibility`? | `"private"` \| `"public"` \| `"internal"` |

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
  visibility: "private" | "public" | "internal";
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
| `opts.visibility`? | `"private"` \| `"public"` \| `"internal"` |

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
| `__namedParameters.opts`? | `GitConfig` |
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
| `opts` | `undefined` \| `GitConfig` | `GitSuper.opts` |

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
| `__namedParameters.opts`? | `GitConfig` |
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
| `opts` | `undefined` \| `GitConfig` | `GitSuper.opts` |

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
| `__namedParameters.opts`? | `GitConfig` |
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
| `opts` | `undefined` \| `GitConfig` | `GitSuper.opts` |

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
| `__namedParameters.opts`? | `GitConfig` |
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
| `opts` | `undefined` \| `GitConfig` | `GitSuper.opts` |

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
  name: string;
  npm: string;
  private: boolean;
  version: string;
}[]>
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `npm` | `boolean` | `true` |
| `showPrivate` | `boolean` | `true` |

###### Returns

`Promise`\<\{
  `name`: `string`;
  `npm`: `string`;
  `private`: `boolean`;
  `version`: `string`;
 \}[]\>

##### getSize()

```ts
getSize(name: string): Promise<void>
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `name` | `string` | `'./'` |

###### Returns

`Promise`\<`void`\>

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
function contributorsPlugin<ID, R>(conf?: ContributorsConfig<ID, R>): Config
```

#### Type Parameters

| Type Parameter |
| ------ |
| `ID` *extends* `string` |
| `R` *extends* `Role`\<`ID`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `conf`? | [`ContributorsConfig`](#contributorsconfigid-r)\<`ID`, `R`\> |

#### Returns

`Config`

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

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `conf`? | `GitConfig` |

#### Returns

`Config`

***

### package2Contributors()

```ts
function package2Contributors(pkg: {
  devEngines: {
     cpu: undefined | {
        name: string;
        onFail: "error" | "warn" | "ignore";
        version: string;
       };
     libc: undefined | {
        name: string;
        onFail: "error" | "warn" | "ignore";
        version: string;
       };
     os: undefined | {
        name: string;
        onFail: "error" | "warn" | "ignore";
        version: string;
       };
     packageManager: undefined | {
        name: string;
        onFail: "error" | "warn" | "ignore";
        version: string;
       };
     runtime: undefined | {
        name: string;
        onFail: "error" | "warn" | "ignore";
        version: string;
       };
    };
 }): {
  member: Contributor[];
  role: Role;
}
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pkg` | `object` | - |
| `pkg.devEngines`? | `object` | The devEngines field aids engineers working on a codebase to all be using the same tooling. **See** https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines |
| `pkg.devEngines.cpu` | `undefined` \| \{ `name`: `string`; `onFail`: `"error"` \| `"warn"` \| `"ignore"`; `version`: `string`; \} | - |
| `pkg.devEngines.libc` | `undefined` \| \{ `name`: `string`; `onFail`: `"error"` \| `"warn"` \| `"ignore"`; `version`: `string`; \} | - |
| `pkg.devEngines.os` | `undefined` \| \{ `name`: `string`; `onFail`: `"error"` \| `"warn"` \| `"ignore"`; `version`: `string`; \} | - |
| `pkg.devEngines.packageManager` | `undefined` \| \{ `name`: `string`; `onFail`: `"error"` \| `"warn"` \| `"ignore"`; `version`: `string`; \} | - |
| `pkg.devEngines.runtime` | `undefined` \| \{ `name`: `string`; `onFail`: `"error"` \| `"warn"` \| `"ignore"`; `version`: `string`; \} | - |

#### Returns

```ts
{
  member: Contributor[];
  role: Role;
}
```

| Name | Type |
| ------ | ------ |
| `member` | `Contributor`[] |
| `role` | `Role` |

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
function repoPlugin<Contr, R>(opts?: Config<Contr, R>): Config
```

Dovenv plugin for managing a repository.

#### Type Parameters

| Type Parameter |
| ------ |
| `Contr` *extends* `string` |
| `R` *extends* `Role`\<`Contr`\> |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | [`Config`](#configi-r)\<`Contr`, `R`\> | Optional configuration. |

#### Returns

`Config`

- The plugin configuration.

## Type Aliases

### Config\<I, R\>

```ts
type Config<I, R>: GitHubConfig & GitConfig & {
  contributors: ContributorsConfig<I, R>;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `contributors`? | [`ContributorsConfig`](#contributorsconfigid-r)\<`I`, `R`\> | Contributors configuration |

#### Type Parameters

| Type Parameter |
| ------ |
| `I` *extends* `string` |
| `R` *extends* `Role`\<`I`\> |

***

### ContributorsConfig\<ID, R\>

```ts
type ContributorsConfig<ID, R>: {
  member: Contributor<Extract<keyof R, string>>[];
  role: R;
};
```

#### Type Parameters

| Type Parameter |
| ------ |
| `ID` *extends* `string` |
| `R` *extends* `Role`\<`ID`\> |

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `member` | `Contributor`\<`Extract`\<keyof `R`, `string`\>\>[] | Set contributor members. **Example** `[ { ghUsername: 'angelespejo', name: 'Angelo', role: 'author' }, { ghUsername: 'pigeonposse', name: 'PigeonPosse', role: 'organization' }, ]` |
| `role` | `R` | Set contributor roles. **Example** `{ 	 * owner: { name: 'Owner', emoji: '👑' }, 	 * developer: { name: 'Developer', emoji: '🤝' }, 	 * organization: { name: 'Organization', emoji: '🏢' }, 	 * sponsor: { name: 'Sponsor', emoji: '🤝' }, 	 * translator: { name: 'Translator', emoji: '🌏' } 	 * },` |

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

## References

### default

Renames and re-exports [repoPlugin](#repoplugin)

## Variables

### CONTRIBUTOR\_ROLE

```ts
const CONTRIBUTOR_ROLE: {
  author: {
     desc: 'Author of the project.';
     emoji: '👑';
     name: 'Author';
    };
  designer: {
     desc: 'Contributor for the design of the project. Images, icons, etc.';
     emoji: '💄';
     name: 'Designer';
    };
  developer: {
     desc: 'Contributor for the development of the project. Code, docs, etc.';
     emoji: '👨‍💻';
     name: 'Developer';
    };
  organization: {
     emoji: '🏢';
     name: 'Organization';
    };
  sponsor: {
     emoji: '🤝';
     name: 'Sponsor';
    };
  translator: {
     emoji: '🌏';
     name: 'Translator';
    };
};
```

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `author` | \{ `desc`: `'Author of the project.'`; `emoji`: `'👑'`; `name`: `'Author'`; \} | - |
| `author.desc` | `string` | 'Author of the project.' |
| `author.emoji` | `string` | '👑' |
| `author.name` | `string` | 'Author' |
| `designer` | \{ `desc`: `'Contributor for the design of the project. Images, icons, etc.'`; `emoji`: `'💄'`; `name`: `'Designer'`; \} | - |
| `designer.desc` | `string` | 'Contributor for the design of the project. Images, icons, etc.' |
| `designer.emoji` | `string` | '💄' |
| `designer.name` | `string` | 'Designer' |
| `developer` | \{ `desc`: `'Contributor for the development of the project. Code, docs, etc.'`; `emoji`: `'👨‍💻'`; `name`: `'Developer'`; \} | - |
| `developer.desc` | `string` | 'Contributor for the development of the project. Code, docs, etc.' |
| `developer.emoji` | `string` | '👨‍💻' |
| `developer.name` | `string` | 'Developer' |
| `organization` | \{ `emoji`: `'🏢'`; `name`: `'Organization'`; \} | - |
| `organization.emoji` | `string` | '🏢' |
| `organization.name` | `string` | 'Organization' |
| `sponsor` | \{ `emoji`: `'🤝'`; `name`: `'Sponsor'`; \} | - |
| `sponsor.emoji` | `string` | '🤝' |
| `sponsor.name` | `string` | 'Sponsor' |
| `translator` | \{ `emoji`: `'🌏'`; `name`: `'Translator'`; \} | - |
| `translator.emoji` | `string` | '🌏' |
| `translator.name` | `string` | 'Translator' |
