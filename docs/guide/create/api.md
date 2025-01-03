# `create-dovenv` - API documentation

## Functions

### create()

```ts
function create(params: CreateTemplateParams): Promise<{
  install: Installer;
  intro: void;
  lang: string;
  monorepo: boolean;
  name: string;
  open: TextEditor;
  output: string;
  plugin: string[];
  theme: string;
}>
```

Creates a new project using the specified parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `CreateTemplateParams` | The parameters required for building the project. |

#### Returns

`Promise`\<\{
  `install`: `Installer`;
  `intro`: `void`;
  `lang`: `string`;
  `monorepo`: `boolean`;
  `name`: `string`;
  `open`: `TextEditor`;
  `output`: `string`;
  `plugin`: `string`[];
  `theme`: `string`;
 \}\>

A promise that resolves to the result of the build process.

| Name | Type |
| ------ | ------ |
| `install`? | `Installer` |
| `intro`? | `void` |
| `lang`? | `string` |
| `monorepo`? | `boolean` |
| `name`? | `string` |
| `open`? | `TextEditor` |
| `output`? | `string` |
| `plugin`? | `string`[] |
| `theme`? | `string` |
