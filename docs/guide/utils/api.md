# `@dovenv/utils` - API documentation

## Classes

### RunLocalNodeBinError

#### Extends

- `Error`

#### Constructors

##### new RunLocalNodeBinError()

```ts
new RunLocalNodeBinError(message?: string): RunLocalNodeBinError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message`? | `string` |

###### Returns

[`RunLocalNodeBinError`](#runlocalnodebinerror)

###### Inherited from

`Error.constructor`

##### new RunLocalNodeBinError()

```ts
new RunLocalNodeBinError(message?: string, options?: ErrorOptions): RunLocalNodeBinError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message`? | `string` |
| `options`? | `ErrorOptions` |

###### Returns

[`RunLocalNodeBinError`](#runlocalnodebinerror)

###### Inherited from

`Error.constructor`

***

### TypedError\<M, D\>

A generic error class that extends the native `Error` class to include
additional contextual data.

This class is useful for creating strongly-typed errors in TypeScript, allowing
you to provide structured data along with the error message for improved error handling.

---

#### Examples

```ts
// Basic usage with a string message

const error = new TypedError('Something went wrong');
console.error(error.message); // "Something went wrong"
```

```ts
// Usage with additional data

const error = new TypedError('Validation failed', { field: 'email', reason: 'invalid' });
console.error(error.message); // "Validation failed"
console.error(error.data); // { field: 'email', reason: 'invalid' }
```

```ts
// Usage in a try-catch block

try {
  throw new TypedError('Database connection failed', { host: 'localhost', port: 5432 });
} catch (err) {
  if (err instanceof TypedError) {
    console.error(`Error: ${err.message}`);
    console.error('Error Data:', err.data);
  }
}
```

```ts
// Custom error class With TypeScript and specific data type

const ERRORS = ['unexpected', 'validation', 'database'] as const;
class AppError extends TypedError<typeof ERRORS[number], { user: string }> {}

const successError = new AppError( 'validation', { user: 'username' } );
const failError = new AppError( 'not-exist', { user: 'username' } );  // Must be fail because message not exist
const failError2 = new AppError( 'unexpected', { key: 'username' } ); // Must be fail because data not match
```

#### Extends

- `Error`

#### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `M` *extends* `string` | `string` | The type of the error message. Defaults to `string`. |
| `D` | `undefined` | The type of the additional data associated with the error. Defaults to `undefined`. |

#### Constructors

##### new TypedError()

```ts
new TypedError<M, D>(message: M, data?: D): TypedError<M, D>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `M` |
| `data`? | `D` |

###### Returns

[`TypedError`](#typederrorm-d)\<`M`, `D`\>

###### Overrides

`Error.constructor`

#### Properties

| Property | Type |
| ------ | ------ |
| `data` | `undefined` \| `D` |

***

### Validation

Utility class for data validation.
Most of the validation functions are a wrapper of `zod` functions.

#### See

https://zod.dev/

#### Constructors

##### new Validation()

```ts
new Validation(): Validation
```

###### Returns

[`Validation`](#validation)

#### Methods

##### createLiteralUnion()

```ts
createLiteralUnion<T>(values: T[]): ZodUnion<[ZodLiteral<T>, ...ZodLiteral<T>[]]>
```

Create a union of literal types from an array of strings.

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `string` |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `values` | `T`[] | The values of the union. |

###### Returns

`ZodUnion`\<[`ZodLiteral`\<`T`\>, `...ZodLiteral<T>[]`]\>

A union of literal types.

###### Example

```ts
const myUnion = createLiteralUnion( ['one', 'two', 'three'] )
// myUnion is a union of 'one', 'two', 'three'
```

#### Properties

| Property | Type | Default value |
| ------ | ------ | ------ |
| `deserialize` | (`shape`: `SzType`, `opts`?: `Partial`\<`DezerializerOptions`\>) => `ZodTypes` | `dezerialize` |
| `Error` | *typeof* `ZodError` | `ValidateError` |
| `formatError` | (`error`: `unknown`) => `string` | `formatValidationError` |
| `schema` | `__module` | `validate` |
| `serialize` | \<`T`\>(`schema`: `T`, `opts`?: `Partial`\<`ZerializerOptions`\>) => `Zerialize`\<`T`\> | `zerialize` |

## Functions

### align()

Aligns text in the terminal.

#### align(text, opts)

```ts
function align(text: string, opts?: {}): string
```

Aligns text in the terminal.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |
| `opts`? | `object` |

##### Returns

`string`

#### align(text, opts)

```ts
function align(text: readonly string[], opts?: {}): string[]
```

Aligns text in the terminal.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | readonly `string`[] |
| `opts`? | `object` |

##### Returns

`string`[]

***

### animate()

```ts
function animate(options?: AnimateProps): {
  start: () => void;
  stop: () => void;
}
```

Creates an animation function that can be started and stopped.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options`? | `AnimateProps` | Options for the animation. |

#### Returns

```ts
{
  start: () => void;
  stop: () => void;
}
```

- Object containing `start` and `stop` functions.

| Name | Type |
| ------ | ------ |
| `start` | () => `void` |
| `stop` | () => `void` |

***

### arePathsEqual()

```ts
function arePathsEqual(path1: string, path2: string): boolean
```

Checks if two file paths are equal after normalization.
Normalization ensures that differences like trailing slashes or redundant path segments are ignored.

---

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path1` | `string` | The first file path to compare. |
| `path2` | `string` | The second file path to compare. |

#### Returns

`boolean`

`true` if the paths are equal, `false` otherwise.

***

### asciiFont()

```ts
function asciiFont(txt: string, font?: Fonts): string
```

Generates ASCII art text using the specified font.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `txt` | `string` | `undefined` | The text to render as ASCII art. |
| `font`? | `Fonts` | `'Standard'` | The font to use for rendering. Defaults to 'Standard'. |

#### Returns

`string`

- The ASCII art text.

#### Example

```ts
const asciiText = asciiFont('Hello, World!', '3-D');
console.log(asciiText);
```

***

### base642ImageBuffer()

```ts
function base642ImageBuffer(input: string): Promise<Buffer<ArrayBuffer>>
```

Converts a base64-encoded image string into a Buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The base64 string representing the image, including the data URI scheme. |

#### Returns

`Promise`\<`Buffer`\<`ArrayBuffer`\>\>

- A promise that resolves to a Buffer containing the image data.

#### Throws

- If the input string is not a valid base64 image string.

***

### box()

```ts
function box(text: string, options?: Options): string
```

Creates a styled box around the provided text.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | The text to display inside the box. |
| `options`? | `Options` | Optional configuration options for the box. |

#### Returns

`string`

- The text with the styled box around it.

#### See

https://www.npmjs.com/package/boxen

#### Example

```ts
const boxedText = box('This is a boxed text', { padding: 1 });
console.log(boxedText);
```

***

### cache()

```ts
function cache<Values>(params: {
  cwd: string;
  id: string;
  projectName: string;
  values: Values;
 }): Promise<{
  defaultValues: values;
  get: <ID>(v?: ID) => ID extends keyof Values ? Values[ID<ID>] : Values;
  path: config.path;
  reset: () => void;
  set: (obj: Partial<Values>) => void;
}>
```

Creates a caching mechanism for storing and retrieving values.

#### Type Parameters

| Type Parameter |
| ------ |
| `Values` *extends* `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` | Parameters for configuring the cache. |
| `params.cwd`? | `string` | Directory to save cache file. Default: System default user config directory. You most likely don't need this. Please don't use it unless you really have to. |
| `params.id` | `string` | Identifier for the values. |
| `params.projectName` | `string` | Project name for search cache. You can reuse the same cache for multiple instances. |
| `params.values` | `Values` | Cache Default Values. |

#### Returns

`Promise`\<\{
  `defaultValues`: `values`;
  `get`: \<`ID`\>(`v`?: `ID`) => `ID` *extends* keyof `Values` ? `Values`\[`ID`\<`ID`\>\] : `Values`;
  `path`: `config.path`;
  `reset`: () => `void`;
  `set`: (`obj`: `Partial`\<`Values`\>) => `void`;
 \}\>

- An object with methods to interact with the cache.

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `defaultValues` | `Values` | values | The default values for the cache. |
| `get` | \<`ID`\>(`v`?: `ID`) => `ID` *extends* keyof `Values` ? `Values`\[`ID`\<`ID`\>\] : `Values` | - | Retrieve a value from the cache. **Example** `const theme = get('theme'); console.log(theme); // Output: 'light'` |
| `path` | `string` | config.path | The path to the cache file. |
| `reset` | () => `void` | - | Resets the cache to its default values. **Example** `reset();` |
| `set` | (`obj`: `Partial`\<`Values`\>) => `void` | - | Updates the cache with the provided values. Merges the existing cached values with the new partial values and updates the cache. |

#### Throws

If the cache value is unexpected or not found.

#### Example

```ts
import { cache } from "@dovenv/utils"

const { get, set } = await cache({
  projectName: 'myApp',
  id: 'userSettings',
  values: {
     theme: 'dark',
     language: 'en'
  },
});

// Set a new value in the cache
set({ theme: 'light' });

// Retrieve a value from the cache
const theme = get('theme');
console.log(theme); // Output: 'light'

// Retrieve all cached values
const allValues = get();
console.log(allValues); // Output: { theme: 'light', language: 'en' }

// Handle unexpected cache value
try {
  const nonExistentValue = get('nonExistent');
} catch (error) {
  console.error('Error:', error.message); // Output: Cache value is unexpected: nonExistent
}
```

***

### cancel()

```ts
function cancel(): never
```

Terminates the Node.js process with exit code 130.

This function is typically used to gracefully handle process termination,
such as when the user sends an interrupt signal (e.g., pressing Ctrl+C in the terminal).

#### Returns

`never`

***

### capitalize()

```ts
function capitalize(s: string): string
```

Capitalizes the first letter of a word.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `s` | `string` | The word to capitalize. |

#### Returns

`string`

- The capitalized word.

***

### catchError()

```ts
function catchError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]>
```

Catches errors from a promise and returns a tuple indicating success or failure.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of the resolved value of the promise. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `promise` | `Promise`\<`T`\> | The promise to handle errors for. |

#### Returns

`Promise`\<[`undefined`, `T`] \| [`Error`]\>

A promise that resolves to a tuple.
         The tuple contains either `[undefined, T]` if the promise is resolved successfully,
         or `[Error]` if an error occurs.

***

### catchExecOutput()

```ts
function catchExecOutput<Res>(command: string): Promise<[Error] | [undefined, Res]>
```

Executes a command and captures its output.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` | `string` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `command` | `string` | The command to execute, including any arguments. |

#### Returns

`Promise`\<[`Error`] \| [`undefined`, `Res`]\>

A promise that resolves with the captured output (stdout).

#### Throws

Will reject with an error if the command fails.

#### Example

```ts
const [error, output] = await catchExecOutput('dovenv --help')
if (error) {
  console.error(error);
} else {
  await writeFile('dovenvHelp.txt', output)
}
```

***

### chroma()

#### chroma(color)

```ts
function chroma(color: string | number | Color): Color
```

Creates a color from a string representation (as supported in CSS).
Creates a color from a number representation [0; 16777215]

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `string` \| `number` \| `Color` | The string to convert to a color. |

##### Returns

`Color`

the color object.

#### chroma(a, b, c, colorSpace)

```ts
function chroma(
   a: number, 
   b: number, 
   c: number, 
   colorSpace?: keyof ColorSpaces): Color
```

Create a color in the specified color space using a, b and c as values.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | `number` | - |
| `b` | `number` | - |
| `c` | `number` | - |
| `colorSpace`? | keyof ColorSpaces | The color space to use. Defaults to "rgb". |

##### Returns

`Color`

the color object.

#### chroma(a, b, c, d, colorSpace)

```ts
function chroma(
   a: number, 
   b: number, 
   c: number, 
   d: number, 
   colorSpace?: keyof ColorSpaces): Color
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | `number` |
| `b` | `number` |
| `c` | `number` |
| `d` | `number` |
| `colorSpace`? | keyof ColorSpaces |

##### Returns

`Color`

#### chroma(values, colorSpace)

```ts
function chroma(values: number[], colorSpace?: keyof ColorSpaces): Color
```

Create a color in the specified color space using values.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `values` | `number`[] | An array of values (e.g. [r, g, b, a?]). |
| `colorSpace`? | keyof ColorSpaces | The color space to use. Defaults to "rgb". |

##### Returns

`Color`

the color object.

***

### color()

```ts
function color(...text: unknown[]): string
```

Provides colors for terminal output.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`text` | `unknown`[] |

#### Returns

`string`

#### Example

```ts
console.log(color.green('This text is green'));
```

***

### columns()

```ts
function columns<Data>(data: Data, options?: GlobalOptions): string
```

Formats data into aligned columns for better readability.

#### Type Parameters

| Type Parameter |
| ------ |
| `Data` *extends* [`ColumnData`](#columndata) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `Data` | The data to format into columns. |
| `options`? | `GlobalOptions` | Optional configuration options for column formatting. |

#### Returns

`string`

- The text with the data formatted into columns.

#### See

https://www.npmjs.com/package/columnify

#### Example

```ts
// data for columns
const data = [
    {
        name: 'mod1',
        description: 'some description which happens to be far larger than the max',
        version: '0.0.1',
    },
    {
        name: 'module-two',
        description: 'another description larger than the max',
        version: '0.2.0',
    }
];

// set columns with custom config
const columnText = columns(data, {
    showHeaders: false,
    minWidth: 20,
    config: {
        description: {
            maxWidth: 30
        }
    }
});

// print columns
console.log(columnText);
```

***

### copyDir()

```ts
function copyDir(options: {
  input: string;
  output: string;
}): Promise<void>
```

Copy a directory from input path to output path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `object` | Options object with input and output paths. |
| `options.input` | `string` | - |
| `options.output` | `string` | - |

#### Returns

`Promise`\<`void`\>

- Resolves when the directory has been copied.

#### Throws

If there is an error copying the directory.

#### Example

```ts
const copyResult = await copyDir({
  input : '/path/to/sourceDir',
  output: '/path/to/destinationDir',
})
```

***

### copyFile()

```ts
function copyFile(options: {
  input: string;
  output: string;
}): Promise<void>
```

Copy a file from input path to output path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `object` | Options object with input and output paths. |
| `options.input` | `string` | - |
| `options.output` | `string` | - |

#### Returns

`Promise`\<`void`\>

- Resolves when the file has been copied.

#### Throws

If there is an error copying the file.

#### Example

```ts
import { copyFile } from '@dovenv/utils'

const copyResult = await copyFile({
  input : '/path/to/source.txt',
  output: '/path/to/destination.txt',
})
```

***

### createBadgeSVG()

```ts
function createBadgeSVG(format: Format): string
```

Cheate shields.io SVGs.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `format` | `Format` |

#### Returns

`string`

#### See

https://www.npmjs.com/package/badge-maker

***

### createBadgeURL()

```ts
function createBadgeURL(params: BadgeURL): string
```

Create shields.io URL

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `BadgeURL` |

#### Returns

`string`

#### See

https://shields.io/badges/

#### Example

```ts
const badgeURL = createBadgeURL({path: 'badge/any_text-you_like-blue'})
```

***

### createCli()

```ts
function createCli(options: {
  args: process.argv;
  fn: <Cli>(cli: Cli) => Promise<Cli>;
}): Promise<Argv<{}>>
```

Create a cli interface.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `object` | Options object with argv and a function to setup the cli. |
| `options.args` | `string`[] | - |
| `options.fn` | \<`Cli`\>(`cli`: `Cli`) => `Promise`\<`Cli`\> | - |

#### Returns

`Promise`\<`Argv`\<\{\}\>\>

- Resolves with the cli interface.

#### Example

```ts
import { createCli, hideBin } from '@dovenv/utils'
const args = hideBin( process.argv ) // removes the uneeded arguments
const cli = await createCli({
  args : args,
  fn   : async cli => {

    cli.command( 'build', 'Run the build process', async () => {
      // ...
    } ).command( 'dev', 'Run the dev server', async () => {
      // ...
    } ).command( 'preview', 'Run the preview server', async () => {
      // ...
    } ).demandCommand( 1, 'You need to specify a command (build, dev, or preview)' )

    return cli

  },
} )
```

***

### createDir()

```ts
function createDir(path: string): Promise<void>
```

Creates a directory at the specified path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path of the directory to create. |

#### Returns

`Promise`\<`void`\>

#### Throws

If an error occurs while creating the directory.

#### Example

```ts
import { createDir } from '@dovenv/utils'
await createDir('./my/dir')
```

***

### createMdLink()

```ts
function createMdLink(__namedParameters: MdLink): string
```

Creates a Markdown link or image from a name and URL.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `MdLink` |

#### Returns

`string`

- The constructed Markdown link or image.

***

### createMdLinks()

```ts
function createMdLinks(links: MdLink[]): string
```

Constructs Markdown links or images from an array of links.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `links` | `MdLink`[] | The links to construct. |

#### Returns

`string`

- The constructed Markdown string.

***

### createMergeDataFn()

```ts
function createMergeDataFn<Config>(opts?: Partial<Readonly<{}>>): (...config: (Config | Config[])[]) => Config
```

Creates a function to merge multiple configuration objects into a single configuration.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `Config` | The type of the configuration objects. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `Partial`\<`Readonly`\<\{\}\>\> | Optional merge options for `deepmergeCustom`. |

#### Returns

`Function`

A function that accepts multiple configuration objects or arrays of configuration objects
and returns a single merged configuration object.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`config` | (`Config` \| `Config`[])[] |

##### Returns

`Config`

#### Example

```ts
const mergeConfig = createMergeDataFn<{ foo: string; bar: string }>()
const config1 = { foo: 'bar' }
const config2 = { bar: 'foo' }
const merged = mergeConfig( config1, config2 )
// or
const merged = mergeConfig( [ config1, config2 ] )
console.log( merged )
```

***

### createSymlink()

```ts
function createSymlink(options: {
  input: string;
  output: string;
}): Promise<void>
```

Creates a symbolic link from the input path to the output path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `object` | Options object with input and output paths. |
| `options.input` | `string` | - |
| `options.output` | `string` | - |

#### Returns

`Promise`\<`void`\>

- Resolves when the symbolic link has been created.

#### Throws

If there is an error creating the symbolic link.

#### Example

```ts
import { createSymlink } from '@dovenv/utils'

const symlinkResult = await createSymlink({
  input : '/path/to/source',
  output: '/path/to/destination',
})
```

***

### decompressFile()

```ts
function decompressFile(options: DecompresFileOptions): Promise<void>
```

Decompresses an archive file (zip, tar, tgz) to a specified output directory.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `DecompresFileOptions` | The options object. |

#### Returns

`Promise`\<`void`\>

#### Example

```ts
decompressFile( {
 input   : resolve(  'downloads', 'example-file.zip' ), // Path to the compressed file
 output  : resolve(  'decompressed' ), // Directory where the file should be decompressed
 newName : 'renamed-decompressed-file', // New name for the decompressed file or directory (optional)
 remove  : true, // Remove the original compressed file after decompression
 } )
```

***

### delay()

```ts
function delay(ms: number): Promise<unknown>
```

Waits for the given number of milliseconds before resolving.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ms` | `number` | The number of milliseconds to wait. |

#### Returns

`Promise`\<`unknown`\>

- A promise that resolves when the delay has finished.

#### Example

```ts
await delay( 1000 ); // waits 1 second
```

***

### deprecatedAlerts()

```ts
function deprecatedAlerts(): {
  hide: () => void;
  show: () => void;
}
```

Show/hide deprecation warnings in the process.

This function sets the `process.noDeprecation` property to `true` | `false`
Note: This is not recommended for production environments, as it might
hide useful deprecation warnings that should be addressed.

#### Returns

```ts
{
  hide: () => void;
  show: () => void;
}
```

An object with `show` and `hide` methods.

| Name | Type |
| ------ | ------ |
| `hide` | () => `void` |
| `show` | () => `void` |

#### Example

```ts
const { show, hide } = deprecatedAlerts()
hide()
// my code
show()
```

***

### deserializeValidation()

```ts
function deserializeValidation(shape: SzType, opts?: Partial<DezerializerOptions>): ZodTypes
```

Deserializes

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `shape` | `SzType` |
| `opts`? | `Partial`\<`DezerializerOptions`\> |

#### Returns

`ZodTypes`

#### See

https://www.npmjs.com/package/zodex?activeTab=readme

***

### downloadGitHubPath()

```ts
function downloadGitHubPath(args: {
  input: string;
  output: string;
  token: string;
}): Promise<void>
```

Downloads a directory from GitHub.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `object` | An object containing the URL of the GitHub repo directory and the path to the output directory. |
| `args.input` | `string` | The URL of the GitHub repo directory. |
| `args.output` | `string` | The path to the output directory. |
| `args.token`? | `string` | The GitHub token for authentication. |

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await downloadGitHubPath({
	input  : 'https://github.com/pigeonposse/backan/tree/main/docs',
	output : './docs',
})
```

***

### downloadGitHubRelease()

```ts
function downloadGitHubRelease(options: {
  filename: string;
  newFilename: string;
  outputPath: string;
  repo: string;
  user: string;
  version: '';
}): Promise<void>
```

Downloads a GitHub release asset using the GitHub CLI and optionally renames the final file.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `object` | The options object. |
| `options.filename` | `string` | The name of the file to download. |
| `options.newFilename`? | `string` | The new name for the file after download (if applicable). |
| `options.outputPath` | `string` | The directory where the file should be saved. |
| `options.repo` | `string` | The GitHub project/repository name. |
| `options.user` | `string` | The GitHub username. |
| `options.version`? | `string` | The release version or 'latest' for the latest release. |

#### Returns

`Promise`\<`void`\>

***

### ensureDir()

```ts
function ensureDir(path: string): Promise<void>
```

Creates a directory if it does not exist.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | Path to the directory to create. |

#### Returns

`Promise`\<`void`\>

- A promise that resolves when the directory has been created.

#### Example

```ts
await ensureDir('./path/to/directory')
```

***

### exec()

```ts
function exec(cmd: string): Promise<void>
```

Executes a command in the shell and waits for it to finish.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cmd` | `string` | The command to execute. |

#### Returns

`Promise`\<`void`\>

- A promise that resolves when the command finishes successfully.

#### Throws

- Throws an error if the command fails.

***

### execChild()

```ts
function execChild(cmd: string): Promise<{
  stderr: string;
  stdout: string;
}>
```

Executes a command in a child process and captures its output.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cmd` | `string` | The command to execute. |

#### Returns

`Promise`\<\{
  `stderr`: `string`;
  `stdout`: `string`;
 \}\>

- A promise that resolves with the output of the command.

| Name | Type |
| ------ | ------ |
| `stderr` | `string` |
| `stdout` | `string` |

#### Throws

- Throws an error if the command fails, along with its stdout and stderr.

***

### execModulePath()

```ts
function execModulePath(params: {
  args: [];
  module: {
     from: string;
     id: string;
     path: string[];
    };
}): Promise<void>
```

Execute a module from a given path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` | Parameters for module execution. |
| `params.args`? | `string`[] | The arguments to pass to the module. |
| `params.module` | `object` | The module to execute. |
| `params.module.from`? | `string` | The path to resolve the module from. **Default** `process.cwd()` |
| `params.module.id` | `string` | The module entry name to resolve, such as a package name |
| `params.module.path`? | `string`[] | Optional additional path segments to join with the resolved module directory. |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the module has finished executing.

#### Throws

Will reject with an error if the module fails to execute.

#### Example

```ts
// Execute the `bin/index.mjs` file in the `@dovenv/utils` module
await execModulePath({
  module: {
	  id: 'dovenv',
	  path: ['dist','cli.mjs'],
  },
  args: ['--help']
})
```

***

### execModulePathWithOutput()

```ts
function execModulePathWithOutput(params: {
  args: [];
  module: {
     from: string;
     id: string;
     path: string[];
    };
 }): Promise<{
  stderr: string;
  stdout: string;
}>
```

Execute a module from a given path and capture its output.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` | Parameters for module execution. |
| `params.args`? | `string`[] | The arguments to pass to the module. |
| `params.module` | `object` | The module to execute. |
| `params.module.from`? | `string` | The path to resolve the module from. **Default** `process.cwd()` |
| `params.module.id` | `string` | The module entry name to resolve, such as a package name |
| `params.module.path`? | `string`[] | Optional additional path segments to join with the resolved module directory. |

#### Returns

`Promise`\<\{
  `stderr`: `string`;
  `stdout`: `string`;
 \}\>

A promise that resolves with the captured output.

| Name | Type |
| ------ | ------ |
| `stderr` | `string` |
| `stdout` | `string` |

#### Throws

Will reject with an error if the module fails to execute.

#### Example

```ts
// Execute the `bin/index.mjs` file in the `dovenv` module and capture its output
const { stdout, stderr } = await execModulePathWithOutput({
  module: {
	  id: 'dovenv',
	  path: ['dist','cli.mjs'],
  },
  args: ['--help']
})
console.log('Output:', stdout)
```

***

### execProcess()

```ts
function execProcess(options: ExecProcessParams): Promise<void>
```

Executes a process with logging and error handling.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `ExecProcessParams` | Options for the process execution. |

#### Returns

`Promise`\<`void`\>

- Resolves when the process execution completes.

#### Example

```ts
const onProcess = async ({ log }) => {
    log.info('Starting the process...');
    // Your process logic here
    log.success('Process completed successfully.');
};

const onError = async ({ log, error }) => {
    log.error('An error occurred:', error);
};

execProcess({
    name: 'MyProcess',
    on: onProcess,
    onError,
});
```

***

### existsDir()

```ts
function existsDir(path: string): Promise<boolean>
```

Checks if a directory exists at the specified path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path to check. |

#### Returns

`Promise`\<`boolean`\>

- A promise that resolves to true if a directory exists at the specified path, otherwise false.

#### Example

```ts
import { existsDir } from '@dovenv/utils'
const exist = await existsDir('./my/dir')
```

***

### existsFile()

```ts
function existsFile(path: string): Promise<boolean>
```

Checks if a file exists at the specified path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path to the file. |

#### Returns

`Promise`\<`boolean`\>

- A promise that resolves to true if the file exists, otherwise false.

#### Throws

If an error occurs while checking the existence of the file.

#### Example

```ts
import { existsFile } from '@dovenv/utils'

const existPKG = await existsFile('./package.json')
```

***

### existsLocalBin()

```ts
function existsLocalBin(binName: string): Promise<boolean>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `binName` | `string` |

#### Returns

`Promise`\<`boolean`\>

***

### existsLocalBins()

```ts
function existsLocalBins<Bin>(binaries: Bin[]): Promise<{ [key in string]: boolean }>
```

#### Type Parameters

| Type Parameter |
| ------ |
| `Bin` *extends* `string` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `binaries` | `Bin`[] |

#### Returns

`Promise`\<`{ [key in string]: boolean }`\>

***

### existsOptions()

```ts
function existsOptions(): boolean
```

Checks if there are additional command-line options provided.

#### Returns

`boolean`

True if there are more than two arguments in the process.argv array, indicating the presence of options; otherwise, false.

***

### existsPath()

```ts
function existsPath(path: string): Promise<boolean>
```

Checks if a file or directory exists at the specified path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path to check. |

#### Returns

`Promise`\<`boolean`\>

- A promise that resolves to true if a file or directory exists at the specified path, otherwise false.

#### Throws

If an error occurs while checking the existence of the path.

#### Example

```ts
import { existsPath } from '@dovenv/utils'

const existPKG = await existsPath('./package.json')
```

***

### fetch2string()

```ts
function fetch2string(url: string): Promise<string>
```

Fetch content from a URL to string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | URL of the resource. |

#### Returns

`Promise`\<`string`\>

- The fetched content.

#### Throws

If there is an error fetching content from the URL.

#### Example

```ts
import { fetch2string } from '@dovenv/utils'

const imageData = await fetch2string('https://source.unsplash.com/random')
console.log(imageData)
```

***

### formatValidationError()

```ts
function formatValidationError(error: unknown): string
```

Converts a validation error into a pretty string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `error` | `unknown` | The error to convert. |

#### Returns

`string`

A pretty string representing the error.

***

### geMDTocString()

```ts
function geMDTocString(opts: MdTocStringOpts): Promise<string>
```

Creates a Markdown index from the given Markdown string.

- If the input is a path, reads the file input.
- If the input is a URL, fetches the content.
- if the input is a string, gets it directly.
---

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `MdTocStringOpts` | Options |

#### Returns

`Promise`\<`string`\>

- The generated Markdown index as a string.

***

### getAbsolutePath()

```ts
function getAbsolutePath(...paths: string[]): string
```

Resolves path segments into an absolute path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`paths` | `string`[] | A sequence of paths or path segments. |

#### Returns

`string`

- The resolved absolute path.

#### Param

Path segments to resolve.

#### Throws

if any of the arguments is not a string.

***

### getArch()

```ts
function getArch(): "arm64" | "x64" | "unknown"
```

Returns the operating system CPU architecture.

#### Returns

`"arm64"` \| `"x64"` \| `"unknown"`

- The operating system CPU architecture.

***

### getArrayFlagValue()

```ts
function getArrayFlagValue(key: string): undefined | string[]
```

Gets the values of a flag passed to the process.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The key of the flag to get the values of. |

#### Returns

`undefined` \| `string`[]

The values of the flag if it exists, or undefined.
The values are returned as an array. If the flag appears multiple times, their values are concatenated.
The flag can appear in two formats:
- `--key=value1,value2,...` - The values are separated by commas.
- `--key value1 value2 ...` - The values follow the flag in separate arguments.

***

### getBaseName()

```ts
function getBaseName(path: string, suffix?: string): string
```

Return the last portion of a path. Similar to the Unix basename command.
Often used to extract the file name from a fully qualified path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | the path to evaluate. |
| `suffix`? | `string` | optionally, an extension to remove from the result. |

#### Returns

`string`

#### Throws

if `path` is not a string or if `ext` is given and is not a string.

***

### getBooleanFlagValue()

```ts
function getBooleanFlagValue(v: string): boolean
```

Checks if a boolean flag exists in the process arguments.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | `string` | The boolean flag to check for existence. |

#### Returns

`boolean`

True if the flag exists, false otherwise.

***

### getCharsAndWords()

```ts
function getCharsAndWords(text: string): {
  chars: number;
  words: number;
}
```

Gets the total number of characters and words in a given string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | The string to analyze. |

#### Returns

```ts
{
  chars: number;
  words: number;
}
```

- An object containing the total number of characters and words.

| Name | Type |
| ------ | ------ |
| `chars` | `number` |
| `words` | `number` |

#### Example

```ts
const result = getCharsAndWords("Hello world!");
console.log(result.chars); // 12
console.log(result.words); // 2
```

***

### getCharsAndWordsFrom()

```ts
function getCharsAndWordsFrom(options: GetCharsAndWordsFromOptions): Promise<{
  chars: 0;
  content: {
     chars: 0;
     words: 0;
    };
  paths: {
     chars: 0;
     words: 0;
    };
  url: {
     chars: 0;
     words: 0;
    };
  words: 0;
}>
```

Gets the total number of characters and words from various sources: glob pattern, URL, or string content.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `GetCharsAndWordsFromOptions` | Options for processing content. |

#### Returns

`Promise`\<\{
  `chars`: `0`;
  `content`: \{
     `chars`: `0`;
     `words`: `0`;
    \};
  `paths`: \{
     `chars`: `0`;
     `words`: `0`;
    \};
  `url`: \{
     `chars`: `0`;
     `words`: `0`;
    \};
  `words`: `0`;
 \}\>

- Total characters and words in the content.

| Name | Type | Default value |
| ------ | ------ | ------ |
| `chars` | `number` | 0 |
| `content` | \{ `chars`: `0`; `words`: `0`; \} | - |
| `content.chars` | `number` | 0 |
| `content.words` | `number` | 0 |
| `paths` | \{ `chars`: `0`; `words`: `0`; \} | - |
| `paths.chars` | `number` | 0 |
| `paths.words` | `number` | 0 |
| `url` | \{ `chars`: `0`; `words`: `0`; \} | - |
| `url.chars` | `number` | 0 |
| `url.words` | `number` | 0 |
| `words` | `number` | 0 |

#### Throws

If an error occurs while processing.

#### Example

```ts
const result = await getCharsAndWordsFrom({ pattern: ['*.md'] });
console.log(result.chars); // Total characters
console.log(result.words); // Total words

const resultFromUrl = await getCharsAndWordsFrom({ url: 'https://example.com/file.txt' });
console.log(resultFromUrl);

const resultFromContent = await getCharsAndWordsFrom({ content: 'Direct string content' });
console.log(resultFromContent);
```

***

### getCharsAndWordsFromContent()

```ts
function getCharsAndWordsFromContent(param0: GetCharsAndWordsFromContentOptions): Promise<GetCharsAndWordsFromResponse>
```

Calculates the total number of characters and words from a list of string content.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `param0` | `GetCharsAndWordsFromContentOptions` | An object containing the input strings to analyze. |

#### Returns

`Promise`\<`GetCharsAndWordsFromResponse`\>

- An object with the total number of characters and words.

#### Example

```ts
const result = await getCharsAndWordsFromContent({ input: ['Hello world!', 'This is a test.'] });
console.log(result.chars); // Total characters
console.log(result.words); // Total words
```

***

### getCharsAndWordsFromPaths()

```ts
function getCharsAndWordsFromPaths(param0: GetCharsAndWordsFromPathsOptions): Promise<GetCharsAndWordsFromResponse>
```

Gets the total number of characters and words in all files matching the given glob pattern.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `param0` | `GetCharsAndWordsFromPathsOptions` | An object containing the input glob pattern and options. |

#### Returns

`Promise`\<`GetCharsAndWordsFromResponse`\>

- An object with the total number of characters and words.

#### Throws

If an error occurs while reading the files.

#### Example

```ts
const result = await getCharsAndWordsFromPaths({ input: ['*.md'] });
console.log(result.chars); // Total characters
console.log(result.words); // Total words
```

***

### getCharsAndWordsFromUrl()

```ts
function getCharsAndWordsFromUrl(param0: GetCharsAndWordsFromPathsOptions): Promise<GetCharsAndWordsFromResponse>
```

Gets the total number of characters and words from the given URLs.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `param0` | `GetCharsAndWordsFromPathsOptions` | An object containing the input URLs. |

#### Returns

`Promise`\<`GetCharsAndWordsFromResponse`\>

- An object with the total number of characters and words.

#### Throws

If an error occurs while fetching the URLs.

#### Example

```ts
const result = await getCharsAndWordsFromUrl({ input: ['https://example.com'] });
console.log(result.chars); // Total characters
console.log(result.words); // Total words
```

***

### getChoiceFlagValue()

```ts
function getChoiceFlagValue<VALUES>(v: string, values: Record<string, VALUES>): undefined | VALUES
```

Checks if a flag exists and the value matches one of the given values.

#### Type Parameters

| Type Parameter |
| ------ |
| `VALUES` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | `string` | The key of the flag to check. |
| `values` | `Record`\<`string`, `VALUES`\> | An object with values to check against the value of the flag. |

#### Returns

`undefined` \| `VALUES`

The value of the flag if it exists and matches one of the given values, or undefined.

***

### getCmd()

```ts
function getCmd(v: string): boolean
```

Checks if a specific command exists in the process arguments.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | `string` | The command to check for existence. |

#### Returns

`boolean`

True if the command exists in the process arguments; otherwise, false.

***

### getCountFromPaths()

```ts
function getCountFromPaths(param0: GetCharsAndWordsFromPathsOptions): Promise<{
  chars: number;
  files: files.length;
  words: number;
}>
```

Gets the total number of characters and words in all files matching the given glob pattern.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `param0` | `GetCharsAndWordsFromPathsOptions` | An object containing the input glob pattern and options. |

#### Returns

`Promise`\<\{
  `chars`: `number`;
  `files`: `files.length`;
  `words`: `number`;
 \}\>

- An object with properties for the number of files, the total number of characters, and the total number of words.

| Name | Type | Default value |
| ------ | ------ | ------ |
| `chars` | `number` | - |
| `files` | `number` | files.length |
| `words` | `number` | - |

#### Throws

If there is an error while reading the files.

***

### getCurrentDateTime()

```ts
function getCurrentDateTime(): {
  day: string;
  hours: string;
  minutes: string;
  month: string;
  seconds: string;
  year: string;
}
```

Gets the current date and time as an object containing separate fields for year, month, day, hours, minutes, and seconds.

#### Returns

```ts
{
  day: string;
  hours: string;
  minutes: string;
  month: string;
  seconds: string;
  year: string;
}
```

- An object representing the current date and time.

| Name | Type |
| ------ | ------ |
| `day` | `string` |
| `hours` | `string` |
| `minutes` | `string` |
| `month` | `string` |
| `seconds` | `string` |
| `year` | `string` |

***

### getCurrentDateTimeString()

```ts
function getCurrentDateTimeString(): string
```

Gets the current date and time in ISO 8601 format as a string.

#### Returns

`string`

- The current date and time as an ISO 8601 string.

***

### getCurrentDir()

```ts
function getCurrentDir(path?: string): string
```

Gets the current directory.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path`? | `string` | An optional path to resolve the directory from. |

#### Returns

`string`

- The current directory.

#### Example

```ts
getCurrentDir()
```

***

### getDirName()

```ts
function getDirName(path: string): string
```

Return the directory name of a path. Similar to the Unix dirname command.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | the path to evaluate. |

#### Returns

`string`

#### Throws

if `path` is not a string.

***

### getDirTree()

```ts
function getDirTree(props: {
  input: string;
  max: number;
  name: string;
  sort: "atoz" | "ztoa";
  style: (opts: SetDirTreeStyleParams) => string;
}): Promise<string>
```

Generates a string representing the directory structure of a given path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `object` | Function props. |
| `props.input` | `string` | The root path of the directory to read. |
| `props.max`? | `number` | The maximum number of directories to traverse. |
| `props.name`? | `string` | - |
| `props.sort`? | `"atoz"` \| `"ztoa"` | The order to traverse the directories. **Default** `'atoz'` |
| `props.style`? | (`opts`: `SetDirTreeStyleParams`) => `string` | - |

#### Returns

`Promise`\<`string`\>

The directory structure as a string.

***

### getExtName()

```ts
function getExtName(path: string): string
```

Return the extension of the path, from the last '.' to end of string in the last portion of the path.
If there is no '.' in the last portion of the path or the first character of it is '.', then it returns an empty string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | the path to evaluate. |

#### Returns

`string`

#### Throws

if `path` is not a string.

***

### getFileText()

```ts
function getFileText(path: string): Promise<string>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `path` | `string` |

#### Returns

`Promise`\<`string`\>

***

### getFilteredFileNames()

```ts
function getFilteredFileNames(props: {
  extensions: [];
  path: string;
}): Promise<string[]>
```

Gets the file names in a directory and filters them by extension.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `object` | Function props. |
| `props.extensions` | `string`[] | Array of extensions to filter by, e.g., ['.md', '.txt']. |
| `props.path` | `string` | Path to the directory. |

#### Returns

`Promise`\<`string`[]\>

- A promise that resolves with an array of file names without extensions.

***

### getHTML()

```ts
function getHTML(path: string): Promise<string>
```

Retrieves the HTML content from a given path or URL or string.

- If the input is a path, reads the file content.
- If the input is a URL, fetches the content.
- If the input is a string, returns it directly.
---

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path or URL to retrieve the HTML content from. |

#### Returns

`Promise`\<`string`\>

- A promise that resolves to the HTML content as a string.

***

### getLocalNodeBinPath()

```ts
function getLocalNodeBinPath(__namedParameters: {
  name: string;
  opts: EnvOptions;
}): Promise<undefined | string>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.name` | `string` |
| `__namedParameters.opts`? | `EnvOptions` |

#### Returns

`Promise`\<`undefined` \| `string`\>

***

### getLocalPkgPath()

```ts
function getLocalPkgPath(packageName: string): undefined | string
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `packageName` | `string` |

#### Returns

`undefined` \| `string`

***

### getMatch()

```ts
function getMatch(
   inputs: string | readonly string[], 
   patterns: string | readonly string[], 
   options?: Options): string[]
```

Simple [wildcard](https://en.wikipedia.org/wiki/Wildcard_character) matching.

It matches even across newlines. For example, `foo*r` will match `foo\nbar`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `inputs` | `string` \| readonly `string`[] | The string or array of strings to match. |
| `patterns` | `string` \| readonly `string`[] | The string or array of string patterns. Use `*` to match zero or more characters. A leading `!` negates the pattern. |
| `options`? | `Options` | - |

#### Returns

`string`[]

An array of `inputs` filtered based on the `patterns`.

#### Example

```
import {matcher} from 'matcher';

matcher(['foo', 'bar', 'moo'], ['*oo', '!foo']);
//=> ['moo']

matcher(['foo', 'bar', 'moo'], ['!*oo']);
//=> ['bar']

matcher('moo', ['']);
//=> []

matcher('moo', []);
//=> []

matcher([''], ['']);
//=> ['']
```

***

### getMD()

```ts
function getMD(path: string): Promise<string>
```

Retrieves the Markdown content from a given path or URL or string.

- If the input is a path, reads the file content.
- If the input is a URL, fetches the content.
- If the input is a string, returns it directly.
---

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path or URL to retrieve the Markdown content from. |

#### Returns

`Promise`\<`string`\>

- A promise that resolves to the Markdown content as a string.

***

### getMDToc()

```ts
function getMDToc(input: string): Promise<{
  anchor: string;
  level: number;
  title: string;
}[]>
```

Parses the given Markdown string and returns an array of objects containing
the title, level and anchor for each header found.

- If the input is a path, reads the file input.
- If the input is a URL, fetches the content.
- if the input is a string, gets it directly.
---

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The Markdown input to parse. |

#### Returns

`Promise`\<\{
  `anchor`: `string`;
  `level`: `number`;
  `title`: `string`;
 \}[]\>

- An array of objects with the following properties:
  - `level`: The header level (1-6).
  - `title`: The header title.
  - `anchor`: The header anchor.

***

### getModulePath()

```ts
function getModulePath(opts: {
  from: string;
  id: string;
  path: string[];
}): Promise<string>
```

Resolves the directory path of a specified module entry.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `object` | An object with options for resolving the module path. |
| `opts.from`? | `string` | The path to resolve the module from. **Default** `process.cwd()` |
| `opts.id` | `string` | The module entry name to resolve, such as a package name |
| `opts.path`? | `string`[] | Optional additional path segments to join with the resolved module directory. |

#### Returns

`Promise`\<`string`\>

- The resolved directory path of the module.

#### Throws

If the module cannot be found in the lookup paths.

#### Example

```ts
const moduleDir = await getModulePath({ id: '@dovenv/utils' })
console.log(moduleDir) // returns: {workspace}/node_modules/@dovenv/utils

const moduleFile = await getModulePath({ id: '@dovenv/utils', path: ['dist','main.mjs'] })
console.log(moduleFile) // returns: {workspace}/node_modules/@dovenv/utils/index.js
```

***

### getObjectFrom()

```ts
function getObjectFrom<Res>(input: string): Promise<Res>
```

Retrieve an object from either a file specified by path or a URL.
Supports JSON, YAML, and TOML formats.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | Path to a file or URL of the resource. |

#### Returns

`Promise`\<`Res`\>

- The object retrieved from the file or URL.

#### Throws

If there is an error fetching data or parsing the object.

#### Example

```ts
import { getObjectFrom } from "@dovenv/utils"

const objectFromYamlUrl = await getObjectFrom( 'https://raw.githubusercontent.com/pigeonposse/super8/main/.pigeonposse.yml' )
const objectFromJSON = await getObjectFrom('/my/file.json')

console.log( objectFromYamlUrl, objectFromJSON )
```

***

### getObjectFromContent()

```ts
function getObjectFromContent<Res>(data: string): Promise<Res>
```

Get object from JSON, YAML, TOML, JS, INI, CSV, or XML string.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `string` | The string to parse. |

#### Returns

`Promise`\<`Res`\>

- The parsed object.

#### Throws

If the data is not a valid object.

#### Example

```ts
import { getObjectFromContent } from "@dovenv/utils"

const jsonContent  = '{"name": "super8"}'
const yamlContent  = 'name: super8'
const tomlContent  = 'name = "super8"'
const object1      = await getObjectFromContent( jsonContent )
const object2      = await getObjectFromContent( yamlContent )
const object3      = await getObjectFromContent( tomlContent )

console.log( object1, object2, object3 )
```

***

### getObjectFromCSVContent()

```ts
function getObjectFromCSVContent<Res>(content: string, options: Options): Promise<Res>
```

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `content` | `string` |
| `options` | `Options` |

#### Returns

`Promise`\<`Res`\>

***

### getObjectFromCSVFile()

```ts
function getObjectFromCSVFile<Res>(path: string): Promise<Res>
```

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `path` | `string` |

#### Returns

`Promise`\<`Res`\>

***

### getObjectFromFile()

```ts
function getObjectFromFile<Res>(path: string): Promise<Res>
```

Retrieve an object from a file specified by path.
Supports JSON, YAML, TOML, JS, INI, CSV, or XML formats.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | Path to the file. |

#### Returns

`Promise`\<`Res`\>

- The object retrieved from the file.

#### Throws

If the file does not exist, or if the data is not an object.

#### Example

```ts
import { getObjectFromFile } from "@dovenv/utils"

const objectFromJSON = await getObjectFromFile('/my/file.json')
const objectFromYAML = await getObjectFromFile('/my/file.yaml')
const objectFromTOML = await getObjectFromFile('/my/file.toml')
const objectFromINI = await getObjectFromFile('/my/file.ini')
console.log(
  objectFromJSON,
  objectFromYAML,
  objectFromTOML,
  objectFromINI
)
```

***

### getObjectFromINIContent()

```ts
function getObjectFromINIContent<Res>(content: string): Promise<Res>
```

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `content` | `string` |

#### Returns

`Promise`\<`Res`\>

***

### getObjectFromINIFile()

```ts
function getObjectFromINIFile<Res>(path: string): Promise<Res>
```

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `path` | `string` |

#### Returns

`Promise`\<`Res`\>

***

### getObjectFromJSContent()

```ts
function getObjectFromJSContent<Res>(content: string, part: string): Promise<Res>
```

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `content` | `string` | `undefined` |
| `part` | `string` | `'default'` |

#### Returns

`Promise`\<`Res`\>

***

### getObjectFromJSFile()

```ts
function getObjectFromJSFile<Res>(path: string, part: string): Promise<Res>
```

Get object from a JavaScript file.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `path` | `string` | `undefined` | Path to the JavaScript file. |
| `part` | `string` | `'default'` | The part of the module to import. Defaults to 'default'. |

#### Returns

`Promise`\<`Res`\>

- The imported object.

#### Throws

If there is an error importing the module.

#### Example

```ts
import { getObjectFromJSFile } from "@dovenv/utils"

const content = await getObjectFromJSFile('/my/file.js')
const part = await getObjectFromJSFile('/my/fs.js', 'path')
console.log(content, part)
```

***

### getObjectFromJSONContent()

```ts
function getObjectFromJSONContent<Res>(content: string): Promise<Res>
```

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `content` | `string` |

#### Returns

`Promise`\<`Res`\>

***

### getObjectFromJSONFile()

```ts
function getObjectFromJSONFile<Res>(path: string): Promise<Res>
```

Get object from a JSON file.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | Path to the JSON file. |

#### Returns

`Promise`\<`Res`\>

- The parsed JSON object.

#### Throws

If there is an error reading the JSON file.

#### Example

```ts
import { getObjectFromJSONFile } from "@dovenv/utils"

const object = await getObjectFromJSONFile('/my/file.json')
console.log( object )
```

***

### getObjectFromNonCheckFile()

```ts
function getObjectFromNonCheckFile<Res>(path: string): Promise<Res>
```

Retrieve an object from a file without checking if is correct file extension.
Supports JSON, YAML, TOML, JS, INI, CSV, or XML formats.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | Path to the file. |

#### Returns

`Promise`\<`Res`\>

- The object retrieved from the file.

#### Throws

If there is an error reading the file or if the data is not an object.

#### Example

```ts
import { getObjectFromNonCheckFile } from "@dovenv/utils"

const objectFromFile = await getObjectFromNonCheckFile('/my/file') // without extension
console.log(objectFromFile)
```

***

### getObjectFromPath()

```ts
function getObjectFromPath<Res>(path: string, filename: string): Promise<Res>
```

Retrieve an object from a file specified by path and filename.
Supports JSON, YAML, TOML, JS, INI, CSV, or XML formats.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | Path to the directory containing the file. |
| `filename` | `string` | Name of the file (without extension). |

#### Returns

`Promise`\<`Res`\>

- The object retrieved from the file.

#### Throws

If the file does not exist, or if the data is not an object.

#### Example

```ts
import { getObjectFromPath } from "@dovenv/utils"

const content = await getObjectFromPath('/my/directory', 'my-file-name')
console.log( content )
```

***

### getObjectFromTOMLContent()

```ts
function getObjectFromTOMLContent<Res>(content: string): Promise<Res>
```

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `content` | `string` |

#### Returns

`Promise`\<`Res`\>

***

### getObjectFromTOMLFile()

```ts
function getObjectFromTOMLFile<Res>(path: string): Promise<Res>
```

Get object from a TOML file.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | Path to the JSON file. |

#### Returns

`Promise`\<`Res`\>

- The parsed JSON object.

#### Throws

If there is an error reading the JSON file.

#### Example

```ts
import { getObjectFromTOMLFile } from "@dovenv/utils"

const objectFromTOML = await getObjectFromTOMLFile('/my/file.toml')
console.log(objectFromTOML)
```

***

### getObjectFromUrl()

```ts
function getObjectFromUrl<Res>(url: string): Promise<Res>
```

Retrieve an object from a URL.
Supports JSON, YAML, and TOML formats.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | URL of the resource. |

#### Returns

`Promise`\<`Res`\>

- The object retrieved from the URL.

#### Throws

If there is an error fetching data from the URL or parsing the object.

#### Example

```ts
import { getObjectFromUrl } from "@dovenv/utils"

// from YAML url
const objectFromYamlUrl = await getObjectFromUrl( 'https://raw.githubusercontent.com/pigeonposse/super8/main/.pigeonposse.yml' )
// from JSON url
const objectFromJsonUrl = await getObjectFromUrl( 'https://raw.githubusercontent.com/pigeonposse/clippo/main/package.json')

console.log( objectFromYamlUrl, objectFromJsonUrl )
```

***

### getObjectFromXMLContent()

```ts
function getObjectFromXMLContent<Res>(content: string): Promise<Res>
```

Parses an XML content string into a JavaScript object.

#### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` | The expected return type of the parsed object. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `content` | `string` | The XML content string to be parsed. |

#### Returns

`Promise`\<`Res`\>

- A promise that resolves to the parsed XML as an object.

#### Throws

If there is an error parsing the XML content.

***

### getObjectFromXMLFile()

```ts
function getObjectFromXMLFile<Res>(path: string): Promise<Res>
```

Fetches and parses an XML file into a JavaScript object.

#### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` | The expected return type of the parsed object. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The file path of the XML file to be read and parsed. |

#### Returns

`Promise`\<`Res`\>

- A promise that resolves to the parsed XML as an object.

#### Throws

If there is an error reading or parsing the XML file.

***

### getObjectFromYAMLContent()

```ts
function getObjectFromYAMLContent<Res>(content: string): Promise<Res>
```

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `content` | `string` |

#### Returns

`Promise`\<`Res`\>

***

### getObjectFromYAMLFile()

```ts
function getObjectFromYAMLFile<Res>(path: string): Promise<Res>
```

Get object from a YAML file.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Res` *extends* `CommonObj` | `CommonObj` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | Path to the JSON file. |

#### Returns

`Promise`\<`Res`\>

- The parsed JSON object.

#### Throws

If there is an error reading the JSON file.

#### Example

```ts
import { getObjectFromYAMLFile } from "@dovenv/utils"

const object = await getObjectFromYAMLFile('/my/file.yaml')
console.log( object )
```

***

### getPalette()

```ts
function getPalette(input: string | HTMLImageElement | Buffer<ArrayBufferLike>): Promise<Palette>
```

Extracts the color palette from the given image.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` \| `HTMLImageElement` \| `Buffer`\<`ArrayBufferLike`\> | The image path or URL or HTMLImageElement or buffer. |

#### Returns

`Promise`\<`Palette`\>

- The color palette.

#### Example

```ts
// simple use
import { getPalette } from '@dovenv/utils'
const palette = await getPalette( 'docs/public/logo.png' )
console.log( palette )
```

***

### getPaths()

Find files and directories using glob patterns.

#### Example

```ts
const paths = await getPaths(['*', '!src']);
console.log(paths);
//=> ['pigeon', 'rainbow']
```

#### getPaths(patterns, options)

```ts
function getPaths(patterns: string | readonly string[], options: {} & FastGlobOptionsWithoutCwd & {}): Promise<GlobEntry[]>
```

Find files and directories using glob patterns.

Note that glob patterns can only contain forward-slashes, not backward-slashes, so if you want to construct a glob pattern from path components, you need to use `path.posix.join()` instead of `path.join()`.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `patterns` | `string` \| readonly `string`[] | See the supported [glob patterns](https://github.com/sindresorhus/globby#globbing-patterns). |
| `options` | \{\} & `FastGlobOptionsWithoutCwd` & \{\} | See the [`fast-glob` options](https://github.com/mrmlnc/fast-glob#options-3) in addition to the ones in this package. |

##### Returns

`Promise`\<`GlobEntry`[]\>

The matching paths.

##### Examples

```ts
const paths = await getPaths(['*', '!src']);
console.log(paths);
//=> ['pigeon', 'rainbow']
```

```
import {globby} from 'globby';

const paths = await globby(['*', '!cake']);

console.log(paths);
//=> ['unicorn', 'rainbow']
```

#### getPaths(patterns, options)

```ts
function getPaths(patterns: string | readonly string[], options?: Options): Promise<string[]>
```

Find files and directories using glob patterns.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `patterns` | `string` \| readonly `string`[] |
| `options`? | `Options` |

##### Returns

`Promise`\<`string`[]\>

##### Example

```ts
const paths = await getPaths(['*', '!src']);
console.log(paths);
//=> ['pigeon', 'rainbow']
```

***

### getPathsStream()

```ts
function getPathsStream(patterns: string | readonly string[], options?: Options): NodeJS.ReadableStream
```

Find files and directories using glob patterns.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `patterns` | `string` \| readonly `string`[] | See the supported [glob patterns](https://github.com/sindresorhus/globby#globbing-patterns). |
| `options`? | `Options` | See the [`fast-glob` options](https://github.com/mrmlnc/fast-glob#options-3) in addition to the ones in this package. |

#### Returns

`NodeJS.ReadableStream`

The stream of matching paths.

#### Examples

```ts
for await (const path of getPathsStream('*.tmp')) {
   console.log(paths);
}
```

```
import {globbyStream} from 'globby';

for await (const path of globbyStream('*.tmp')) {
	console.log(path);
}
```

***

### getPathsStructure()

```ts
function getPathsStructure(props: PathsStructureParams): Promise<object>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `PathsStructureParams` |

#### Returns

`Promise`\<`object`\>

***

### getPathsTree()

```ts
function getPathsTree(props: {
  input: string[];
  max: number;
  name: string;
  patternOpts: Options;
  sort: "atoz" | "ztoa";
  style: (opts: SetDirTreeStyleParams) => string;
}): Promise<string>
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `object` | - |
| `props.input` | `string`[] | The input paths to process. |
| `props.max`? | `number` | The maximum number of directories to traverse. |
| `props.name`? | `string` | - |
| `props.patternOpts`? | `Options` | Additional options for the pattern. |
| `props.sort`? | `"atoz"` \| `"ztoa"` | The order to traverse the directories. **Default** `'atoz'` |
| `props.style`? | (`opts`: `SetDirTreeStyleParams`) => `string` | - |

#### Returns

`Promise`\<`string`\>

***

### getPKG()

```ts
function getPKG(packageName: string, opts?: Opts): Promise<JSONSchemaForNPMPackageJsonFiles>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `packageName` | `string` |
| `opts`? | `Opts` |

#### Returns

`Promise`\<`JSONSchemaForNPMPackageJsonFiles`\>

***

### getPKGVersion()

```ts
function getPKGVersion(packageName: string): Promise<undefined | string>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `packageName` | `string` |

#### Returns

`Promise`\<`undefined` \| `string`\>

***

### getPlatform()

```ts
function getPlatform(): Promise<"linux" | "windows" | "macos" | "unknown">
```

Determines the operating system.

#### Returns

`Promise`\<`"linux"` \| `"windows"` \| `"macos"` \| `"unknown"`\>

- The operating system. Possible values are 'linux', 'macos', or 'windows'.

***

### getStringFlagValue()

```ts
function getStringFlagValue(key: string): undefined | string
```

Gets the value of a flag passed to the process.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The key of the flag to get the value of. |

#### Returns

`undefined` \| `string`

The value of the flag if it exists, or undefined.

***

### getStringFrom()

```ts
function getStringFrom(input: string): Promise<string>
```

Retrieves a string from either a file specified by path or a URL.
Supports fetching remote content via URLs and reading local files.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | Path to a file or URL of the resource. |

#### Returns

`Promise`\<`string`\>

- The string retrieved from the file or URL.

#### Throws

If there is an error fetching data or parsing the string.

#### Example

```ts
import { getStringFrom } from "@dovenv/utils"

const stringFromYamlUrl = await getStringFrom( 'https://raw.githubusercontent.com/pigeonposse/super8/main/.pigeonposse.yml' )
const stringFromJSON = await getStringFrom('/my/file.json')

console.log( stringFromYamlUrl, stringFromJSON )
```

***

### getStringsFrom()

```ts
function getStringsFrom(patterns: string[]): Promise<({
  content: string;
  id: string;
  path: path;
  type: "path";
 } | {
  content: string;
  id: string;
  path: pattern;
  type: "url";
 } | {
  content: pattern;
  id: string;
  path: pattern;
  type: "text";
})[]>
```

Fetches all strings from a given patterns (URLs or paths).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `patterns` | `string`[] | An array of strings with URLs or paths. |

#### Returns

`Promise`\<(\{
  `content`: `string`;
  `id`: `string`;
  `path`: `path`;
  `type`: `"path"`;
 \} \| \{
  `content`: `string`;
  `id`: `string`;
  `path`: `pattern`;
  `type`: `"url"`;
 \} \| \{
  `content`: `pattern`;
  `id`: `string`;
  `path`: `pattern`;
  `type`: `"text"`;
 \})[]\>

- The fetched content.

#### Throws

If there is an error fetching content from the URLs or paths.

#### Example

```ts
import { getStringsFrom } from '@dovenv/utils'

const patterns = [
  'https://pigeonposse.com', // fetches and returns content as a string
  './docs/*.md',             // reads files matching the pattern and returns content as strings
  'Just a simple string'     // returns the same string as provided
];

const data = await getStringsFrom(patterns);
console.log(data);
```

***

### getStringType()

```ts
function getStringType(value: string): "text" | "path" | "url"
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`"text"` \| `"path"` \| `"url"`

***

### getTempDir()

```ts
function getTempDir(): string
```

Returns the path to the operating system's temporary directory.

#### Returns

`string`

The path to the operating system's temporary directory.

***

### gif()

```ts
function gif(params: {
  asciiOptions: {
     c_ratio: number;
     chars: string;
     color: boolean;
     fit:   | "box"
        | "width"
        | "none"
        | "height"
        | "original";
    };
  asciiOutput: boolean;
  input: MediaInput;
 }): Promise<{
  start: () => void;
  stop: () => void;
}>
```

Displays a GIF in the terminal.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` | Options for displaying the GIF. |
| `params.asciiOptions`? | `object` | Options for asciiOutput. |
| `params.asciiOptions.c_ratio`? | `number` | Since a monospace character is taller than it is wide, this property defines the integer approximation of the ratio of the width to height. You probably don't need to change this. **Default** `2` |
| `params.asciiOptions.chars`? | `string` | The characters to use for the asciified image. **Default** ` .,:;i1tfLCG08@` |
| `params.asciiOptions.color`? | `boolean` | Defines if the output should be colored (`true`) or black and white (`false`) **Default** `true` |
| `params.asciiOptions.fit`? | \| `"box"` \| `"width"` \| `"none"` \| `"height"` \| `"original"` | The fit to resize the image to: • `box` - Resize the image such that it fits inside a bounding box defined by the specified width and height. Maintains aspect ratio. • `width` - Resize the image by scaling the width to the specified width. Maintains aspect ratio. • `height` - Resize the image by scaling the height to the specified height. Maintains aspect ratio. • `original` - Doesn't resize the image. • `none` - Scales the width and height to the specified values, ignoring original aspect ratio. **Default** `box` |
| `params.asciiOutput`? | `boolean` | Enable a ascii output. **Default** `false` |
| `params.input` | `MediaInput` | Input to the media PATH, URL, STRING or BUFFER. |

#### Returns

`Promise`\<\{
  `start`: () => `void`;
  `stop`: () => `void`;
 \}\>

- A promise that resolves with an object containing a single method `stop()`. Calling `stop()` will clear the GIF from the terminal.

| Name | Type |
| ------ | ------ |
| `start` | () => `void` |
| `stop` | () => `void` |

#### Example

```ts
// simple use with url
const myGif = await gif({
  input: 'https://64.media.tumblr.com/38adef3da23d26058e3085ce271b39c1/tumblr_nil77wk20l1qhnszoo1_400.gifv'
});
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
await myGif.start();
await delay(5000);
await myGif.stop();
await delay(2000);
await myGif.start();
```

***

### gif2ascii()

```ts
function gif2ascii(params: {
  animate: Omit<AnimateProps, "frames">;
  c_ratio: number;
  chars: string;
  color: boolean;
  fit:   | "box"
     | "width"
     | "none"
     | "height"
     | "original";
  height: string | number;
  input: MediaInput;
  width: string | number;
 }): Promise<{
  start: () => void;
  stop: () => void;
}>
```

Converts a GIF to an ASCII animation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` | Options for converting the GIF. |
| `params.animate`? | `Omit`\<`AnimateProps`, `"frames"`\> | Options for the animation. |
| `params.c_ratio`? | `number` | Since a monospace character is taller than it is wide, this property defines the integer approximation of the ratio of the width to height. You probably don't need to change this. **Default** `2` |
| `params.chars`? | `string` | The characters to use for the asciified image. **Default** ` .,:;i1tfLCG08@` |
| `params.color`? | `boolean` | Defines if the output should be colored (`true`) or black and white (`false`) **Default** `true` |
| `params.fit`? | \| `"box"` \| `"width"` \| `"none"` \| `"height"` \| `"original"` | The fit to resize the image to: • `box` - Resize the image such that it fits inside a bounding box defined by the specified width and height. Maintains aspect ratio. • `width` - Resize the image by scaling the width to the specified width. Maintains aspect ratio. • `height` - Resize the image by scaling the height to the specified height. Maintains aspect ratio. • `original` - Doesn't resize the image. • `none` - Scales the width and height to the specified values, ignoring original aspect ratio. **Default** `box` |
| `params.height`? | `string` \| `number` | The height to resize the image to. Use a percentage to set the image width to x% of the terminal window height. **Default** `100%` |
| `params.input` | `MediaInput` | Input to the media PATH, URL, STRING or BUFFER. |
| `params.width`? | `string` \| `number` | The width to resize the image to. Use a percentage to set the image width to x% of the terminal window width. **Default** `100%` |

#### Returns

`Promise`\<\{
  `start`: () => `void`;
  `stop`: () => `void`;
 \}\>

- A promise that resolves with a string containing the ASCII animation.

| Name | Type |
| ------ | ------ |
| `start` | () => `void` |
| `stop` | () => `void` |

***

### gif2asciiArray()

```ts
function gif2asciiArray(params: {
  c_ratio: number;
  chars: string;
  color: boolean;
  fit:   | "box"
     | "width"
     | "none"
     | "height"
     | "original";
  height: string | number;
  input: MediaInput;
  width: string | number;
}): Promise<string[]>
```

Converts each frame of a GIF image to an ASCII string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` | Options for converting the GIF. |
| `params.c_ratio`? | `number` | Since a monospace character is taller than it is wide, this property defines the integer approximation of the ratio of the width to height. You probably don't need to change this. **Default** `2` |
| `params.chars`? | `string` | The characters to use for the asciified image. **Default** ` .,:;i1tfLCG08@` |
| `params.color`? | `boolean` | Defines if the output should be colored (`true`) or black and white (`false`) **Default** `true` |
| `params.fit`? | \| `"box"` \| `"width"` \| `"none"` \| `"height"` \| `"original"` | The fit to resize the image to: • `box` - Resize the image such that it fits inside a bounding box defined by the specified width and height. Maintains aspect ratio. • `width` - Resize the image by scaling the width to the specified width. Maintains aspect ratio. • `height` - Resize the image by scaling the height to the specified height. Maintains aspect ratio. • `original` - Doesn't resize the image. • `none` - Scales the width and height to the specified values, ignoring original aspect ratio. **Default** `box` |
| `params.height`? | `string` \| `number` | The height to resize the image to. Use a percentage to set the image width to x% of the terminal window height. **Default** `100%` |
| `params.input` | `MediaInput` | Input to the media PATH, URL, STRING or BUFFER. |
| `params.width`? | `string` \| `number` | The width to resize the image to. Use a percentage to set the image width to x% of the terminal window width. **Default** `100%` |

#### Returns

`Promise`\<`string`[]\>

- A promise that resolves with an array of ASCII strings, each representing a frame of the GIF.

***

### gif2images()

```ts
function gif2images(params: {
  input: MediaInput;
}): Promise<Buffer<ArrayBufferLike>[]>
```

Extracts frames from a GIF image and returns them as an array of buffers.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` | Options for extracting frames from the GIF. |
| `params.input` | `MediaInput` | Input to the media PATH, URL, STRING or BUFFER. |

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>[]\>

- A promise that resolves with an array of buffers, each representing a frame of the GIF.

***

### gradient()

```ts
function gradient(
   txt: string, 
   colors: GradientColors, 
   opts?: GradientOpts): string
```

Generates a gradient string with the specified colors.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `txt` | `string` | The text to apply the gradient to. |
| `colors` | [`GradientColors`](#gradientcolors) | An array of color names or hex values. |
| `opts`? | [`GradientOpts`](#gradientopts) | Custom opts. |

#### Returns

`string`

- The text with the applied gradient.

#### Example

```ts
// Example usage:
const gradientText = gradient('Gradient Text', ['red', 'yellow', 'green']);
console.log(gradientText);
```

***

### hideBin()

```ts
function hideBin(argv: string[]): string[]
```

Hides the first two arguments from the process.argv array.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `argv` | `string`[] |

#### Returns

`string`[]

Array of arguments without the first two elements.

#### Example

```ts
import { hideBin } from '@dovenv/utils'
const args = hideBin( process.argv ) // removes the uneeded arguments
console.log( args )
```

***

### highlight()

```ts
function highlight(code: string, opts?: HighlightOptions): string
```

Highlights the given code using CLI highlighting.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `code` | `string` | The code to highlight. |
| `opts`? | `HighlightOptions` | Optional options for highlighting. |

#### Returns

`string`

- The highlighted code.

#### Example

```ts
const code = `
function greet(name) {
    return 'Hello, ' + name + '!';
}
console.log(greet('World'));
`;

const highlightedCode = highlight(code, { language: 'javascript' });
console.log(highlightedCode);
```

***

### html2md()

```ts
function html2md(input: string): Promise<string>
```

Converts HTML to Markdown.

- If the input is a path, reads the file and converts its content.
- If the input is a URL, fetches the content and converts it.
- if the input is a string, converts it directly.
---

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The HTML input to convert. |

#### Returns

`Promise`\<`string`\>

- The converted Markdown as a string.

***

### html2terminal()

```ts
function html2terminal(input: string): Promise<string>
```

Converts HTML to a formatted string suitable for the terminal.

- If the input is a path, reads the file and converts its content.
- If the input is a URL, fetches the content and converts it.
- if the input is a string, converts it directly.
---

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The HTML input to convert. |

#### Returns

`Promise`\<`string`\>

- The formatted string.

***

### image()

```ts
function image(params: ImageProps): Promise<string>
```

Return an image for been print.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`ImageProps`](#imageprops) | Options to customize the display of the image. |

#### Returns

`Promise`\<`string`\>

- Promise that resolves with the image formatted for the terminal.

#### Examples

```ts
// simple use with url
const IMG = await image( {
   input: 'https://avatars.githubusercontent.com/u/111685953'
});
console.log( IMG );
```

```ts
// simple use with path
const IMG = await image( {
  input: './image.png'
});
console.log( IMG );
```

```ts
// ascii output
const IMG = await image( {
  input: 'https://avatars.githubusercontent.com/u/111685953',
  asciiOutput: true
});
console.log(IMG);
```

```ts
// ascii output with custom opts
const IMG = await image( {
   input: 'https://avatars.githubusercontent.com/u/111685953',
   width: '100%',
   height: '100%',
   preserveAspectRatio: true,
   asciiOutput: true,
   asciiOptions: {
      chars: ' #*',
   }
});
console.log(IMG);
```

***

### image2ascii()

```ts
function image2ascii(params: Image2AsciiProps): Promise<string>
```

Converts an image to ASCII art.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`Image2AsciiProps`](#image2asciiprops) | Parameters for the conversion. |

#### Returns

`Promise`\<`string`\>

- Promise that resolves to the ASCII representation of the image.

#### Examples

```ts
// simple use with url
const IMG = await image2ascii( {
   input: 'https://avatars.githubusercontent.com/u/111685953'
});
console.log( IMG );
```

```ts
// simple use with path
const IMG = await image2ascii( {
  input: './image.png'
});
console.log( IMG );
```

```ts

```

***

### incrementMdHeaders()

```ts
function incrementMdHeaders(content: string): string
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `content` | `string` |

#### Returns

`string`

***

### indent()

```ts
function indent(v: string, prefix?: string): string
```

Indents a given string by prefixing each line with a given prefix
(default is two spaces).

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `v` | `string` | `undefined` | The string to indent. |
| `prefix`? | `string` | `' '` | The prefix to prepend to each line (default is two spaces). |

#### Returns

`string`

- The indented string.

***

### isAbsolutePath()

```ts
function isAbsolutePath(path: string): boolean
```

Determines whether \{path\} is an absolute path. An absolute path will always resolve to the same location, regardless of the working directory.

If the given \{path\} is a zero-length string, `false` will be returned.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | path to test. |

#### Returns

`boolean`

#### Throws

if `path` is not a string.

***

### isDev()

```ts
function isDev(): boolean
```

Checks if the environment is a development environment.

#### Returns

`boolean`

True if the environment is a development environment.

***

### isDirectory()

```ts
function isDirectory(path: string): Promise<boolean>
```

Checks if the given path points to a directory.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path to check. |

#### Returns

`Promise`\<`boolean`\>

- A promise that resolves to true if the path points to a directory, otherwise false.

#### Example

```ts
import { isDirectory } from '@dovenv/utils'

const isDir = await isDirectory('./my/path')
```

***

### isGitHubAuthenticated()

```ts
function isGitHubAuthenticated(): boolean
```

Checks if the user is authenticated to GitHub using the GitHub CLI.

#### Returns

`boolean`

True if the user is authenticated, false otherwise.

***

### isPath()

```ts
function isPath(str: string): boolean
```

Check if a string is a valid path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `str` | `string` | The string to test. |

#### Returns

`boolean`

True if the string is a valid path.

#### Example

```ts
isPath('..') // true
isPath('foo bar') // false
isPath('C:\\') // true
isPath('foo\\bar') // true
isPath('foo/bar') // true
isPath('foo bar/baz') // false
```

***

### joinPath()

```ts
function joinPath(...paths: string[]): string
```

Joins path segments.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`paths` | `string`[] | Path segments to join. |

#### Returns

`string`

- The joined path.

#### Example

```ts
joinPath('user', 'pigeonposse')
```

***

### joinUrl()

```ts
function joinUrl(...parts: string[]): string
```

Joins the given URL parts into a single string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`parts` | `string`[] | The URL parts to join. |

#### Returns

`string`

- The joined URL string.

***

### line()

```ts
function line(props?: LineProps): string
```

Generates a line with a title and customizable alignment for both the title and line.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props`? | `LineProps` | Options object |

#### Returns

`string`

Formatted line

#### Throws

If `width` is not between 1 and 100

***

### link()

```ts
function link(text: string, url: string): string
```

Creates a clickable hyperlink in the terminal, if supported.
If terminal doesn't support clickable links, returns the URL string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | The text to display as the link. |
| `url` | `string` | The URL to link to. |

#### Returns

`string`

- The clickable hyperlink or URL string.

#### Example

```ts
const linkedText = link('Visit Clippo docs', 'https://clippo.pigeonposse.com');
console.log(linkedText);
```

***

### localStorage()

```ts
function localStorage(location: string): LocalStorage
```

Creates a new instance of LocalStorage with the specified location.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `location` | `string` | The location where the local storage data will be stored. |

#### Returns

`LocalStorage`

- A new instance of LocalStorage.

#### Example

```ts
import { localStorage } from "@dovenv/utils"

// Creates a local storage instance in the './myStorage' directory
const storage = localStorage('./myStorage');
// Sets an item in the local storage
storage.setItem('key', 'value');
// Retrieves the value of the item from the local storage
const value = storage.getItem('key');
```

***

### md2html()

```ts
function md2html(input: string): Promise<string>
```

Converts Markdown input to HTML.

- If the input is a path, reads the file and converts its content.
- If the input is a URL, fetches the content and converts it.
- if the input is a string, converts it directly.
---

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The Markdown input to convert. |

#### Returns

`Promise`\<`string`\>

- The converted HTML string.

***

### md2terminal()

```ts
function md2terminal(input: string, opts?: Md2TerminalOpts): Promise<string>
```

Converts a Markdown input to a terminal formatted string.

- If the input is a path, reads the file and converts its content.
- If the input is a URL, fetches the content and converts it.
- if the input is a string, converts it directly.
---

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The Markdown string, path or URL to convert. |
| `opts`? | `Md2TerminalOpts` | Options |

#### Returns

`Promise`\<`string`\>

- The converted string.

***

### normalizePath()

```ts
function normalizePath(path: string): string
```

Normalize a string path, reducing '..' and '.' parts.
When multiple slashes are found, they're replaced by a single one; when the path contains a trailing slash, it is preserved. On Windows backslashes are used.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | string path to normalize. |

#### Returns

`string`

#### Throws

if `path` is not a string.

***

### object2string()

```ts
function object2string(data: unknown): string
```

Converts an object to a JSON string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `unknown` | The data to convert to a string. |

#### Returns

`string`

- The JSON string representation of the data.

***

### onCancel()

```ts
function onCancel(cb: ExitListener): void
```

Registers an event listener that will be called when the user sends an
interrupt signal (e.g., pressing Ctrl+C in the terminal).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cb` | `ExitListener` | The callback to be called when the user sends an interrupt signal. |

#### Returns

`void`

***

### onConsole()

```ts
function onConsole(opts: onConsoleOpts): {
  start: () => void;
  stop: () => void;
}
```

Intercepts console methods and applies a transformation function to all arguments.

Useful for replacing certain values in console output, such as API keys or other sensitive information.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `onConsoleOpts` | Options for the console interceptor. |

#### Returns

```ts
{
  start: () => void;
  stop: () => void;
}
```

A Object with `start` and `stop` methods.

| Name | Type |
| ------ | ------ |
| `start` | () => `void` |
| `stop` | () => `void` |

#### Example

```ts
import { onConsole } from '@dovenv/utils'
const secretOut = onConsole({
  type : ['log', 'warn'],
  fn : ( { data } ) => data.replace( /secret/g, '***' ),,
});

secretOut.start();
// my code
secretOut.stop();
```

***

### onExit()

```ts
function onExit(cb: ExitListener): void
```

Registers an event listener that will be called when the Node.js process exits.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cb` | `ExitListener` | The callback to be called when the process exits. |

#### Returns

`void`

***

### onStd()

```ts
function onStd(opts: onStdOpts): {
  start: () => void;
  stop: () => void;
}
```

Replaces the output of `stdout` or `stderr` streams with a custom transformation function.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `onStdOpts` | Options for customizing the stream transformation. |

#### Returns

```ts
{
  start: () => void;
  stop: () => void;
}
```

A Object with `start` and `stop` methods.

| Name | Type |
| ------ | ------ |
| `start` | () => `void` |
| `stop` | () => `void` |

#### Example

```ts
import { onStd } from '@dovenv/utils'
const secretOut = onStd({
  type : 'stdout',
  fn : ( { data } ) => data.replace( /secret/g, '***' ),,
});

secretOut.start();
// my code
secretOut.stop();
```

***

### open()

```ts
function open(target: string, options?: Options): Promise<ChildProcess>
```

Opens a system file or URL.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `string` | The thing you want to open. Can be a URL, file, or executable. Opens in the default app for the file type. For example, URLs open in your default browser. |
| `options`? | `Options` | - |

#### Returns

`Promise`\<`ChildProcess`\>

The [spawned child process](https://nodejs.org/api/child_process.html#child_process_class_childprocess). You would normally not need to use this for anything, but it can be useful if you'd like to attach custom event listeners or perform other operations directly on the spawned process.

#### Param

The file path or URL to open.

#### Examples

```ts
import { open } from "@dovenv/utils"

// Opens the image in the default image viewer.
await open('pigeon.png', {wait: true});
```

```
import open, {apps} from 'open';

// Opens the image in the default image viewer.
await open('unicorn.png', {wait: true});
console.log('The image viewer app quit');

// Opens the URL in the default browser.
await open('https://sindresorhus.com');

// Opens the URL in a specified browser.
await open('https://sindresorhus.com', {app: {name: 'firefox'}});

// Specify app arguments.
await open('https://sindresorhus.com', {app: {name: 'google chrome', arguments: ['--incognito']}});

// Opens the URL in the default browser in incognito mode.
await open('https://sindresorhus.com', {app: {name: apps.browserPrivate}});
```

***

### openApp()

```ts
function openApp(name: string | readonly string[], options?: OpenAppOptions): Promise<ChildProcess>
```

Open an app. Cross-platform.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` \| readonly `string`[] | The app you want to open. Can be either builtin supported `apps` names or other name supported in platform. |
| `options`? | `OpenAppOptions` | - |

#### Returns

`Promise`\<`ChildProcess`\>

The [spawned child process](https://nodejs.org/api/child_process.html#child_process_class_childprocess). You would normally not need to use this for anything, but it can be useful if you'd like to attach custom event listeners or perform other operations directly on the spawned process.

#### Param

The app you want to open. Can be either builtin supported apps names or other name supported in platform.

#### Examples

```ts
import { openApp } from "@dovenv/utils"

// Open Xcode
await openApp('xcode');
```

```
import open, {openApp, apps} from 'open';

// Open Firefox.
await openApp(apps.firefox);

// Open Chrome in incognito mode.
await openApp(apps.chrome, {arguments: ['--incognito']});

// Open default browser.
await openApp(apps.browser);

// Open default browser in incognito mode.
await openApp(apps.browserPrivate);

// Open Xcode.
await openApp('xcode');
```

***

### performance()

```ts
function performance(): {
  prettyStop: () => string;
  stop: () => number;
}
```

Creates a performance tracker to measure elapsed time.

#### Returns

```ts
{
  prettyStop: () => string;
  stop: () => number;
}
```

An object containing methods to stop and retrieve the elapsed time.

| Name | Type | Description |
| ------ | ------ | ------ |
| `prettyStop` | () => `string` | Formats and returns the elapsed time as a human-readable string. |
| `stop` | () => `number` | Calculates and returns the elapsed time in seconds. |

***

### promptGroup()

```ts
function promptGroup(props: PromptOptions | (this: Enquirer<object>) => PromptOptions | PromptOptions | ((this: Enquirer<object>) => PromptOptions)[]): Promise<object>
```

Ask questions to user with prompt function.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `PromptOptions` \| (`this`: `Enquirer`\<`object`\>) => `PromptOptions` \| PromptOptions \| ((this: Enquirer\<object\>) =\> PromptOptions)[] | PromptOptions. |

#### Returns

`Promise`\<`object`\>

- Promise resolving to answers.

#### Example

```ts
const answers = await promptGroup([
  {
    type: 'toggle',
    name: 'ready',
    message: 'Are you ready?',
    enabled: 'Yep',
    disabled: 'Nope',
  },
  {
    type: 'number',
    name: 'age',
    message: 'What is your age',
  },
]);
console.log(answers.ready, answers.age)
```

#### See

https://www.npmjs.com/package/enquirer

***

### promptLineEnquirer()

```ts
function promptLineEnquirer(props: PromptOptions | (this: Enquirer<object>) => PromptOptions | PromptOptions | ((this: Enquirer<object>) => PromptOptions)[], onCancel?: () => void): Promise<unknown>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `PromptOptions` \| (`this`: `Enquirer`\<`object`\>) => `PromptOptions` \| PromptOptions \| ((this: Enquirer\<object\>) =\> PromptOptions)[] |
| `onCancel`? | () => `void` |

#### Returns

`Promise`\<`unknown`\>

***

### promptLineGroup()

```ts
function promptLineGroup<T>(params: PromptLineParams<T>): Promise<{ [P in string | number | symbol]: PromptGroupAwaitedReturn<T>[P] }>
```

Define a group of prompts to be displayed and return a results of objects within the group.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`PromptLineParams`](#promptlineparamst)\<`T`\> | PromptLine options . |

#### Returns

`Promise`\<\{ \[P in string \| number \| symbol\]: PromptGroupAwaitedReturn\<T\>\[P\] \}\>

- Object with answers.

#### Example

```ts
import { promptLineGroup } from "@dovenv/utils"

const answers = await promptLineGroup({
    intro: 'Dovenv init',
    outro: 'Succesfully finished 🌈',
    onCancel: p => {
        p.cancel('canceled 💔')
        process.exit(0)
    },
    list: async p => ({
       name: () => p.text({
           message: 'What is your organization?',
           placeholder: 'PigeonPosse',
           defaultValue: 'PigeonPosse',
       }),
       age: () => p.number({
           message: 'What is your age?',
       }),
    })
})

console.log(answers.name, answers.age)
```

***

### qrcode()

```ts
function qrcode(input: string, opts?: QRcodeOpts): Promise<string>
```

Generates a QR code string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The input string to generate the QR code from. |
| `opts`? | [`QRcodeOpts`](#qrcodeopts) | Optional options for generating the QR code. |

#### Returns

`Promise`\<`string`\>

- A promise that resolves with the generated QR code string.

#### Example

```ts
import { qrcode } from "@dovenv/utils"
try {
  const qrString = await qrcode('https://clippo.pigeonposse.com');
  console.log(qrString);
} catch (error) {
  console.error('Error generating QR code:', error);
}
```

***

### readDir()

```ts
function readDir(path: string): Promise<Dirent[]>
```

Reads the contents of a directory.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | Path to the directory to read. |

#### Returns

`Promise`\<`Dirent`[]\>

- A promise that resolves to an array of [fs.Dirent](https://nodejs.org/api/fs.html#class-fs-dirent) objects.

#### Example

```ts
const dirItems = await readDir('./path/to/directory')
```

***

### readFile()

Reads the content of a file at the specified path.

#### Param

The path of the file to read.

#### Throws

If an error occurs while reading the file.

#### Example

```ts
import { readFile } from '@dovenv/utils'

try {
  const content = await readFile('./example.txt');
  console.log(content);
} catch (error) {
  console.error('Error reading file:', error);
}
```

#### readFile(path, options)

```ts
function readFile(path: PathLike | FileHandle, options?: null | {} & Abortable): Promise<Buffer>
```

Asynchronously reads the entire contents of a file.

If no encoding is specified (using `options.encoding`), the data is returned
as a `Buffer` object. Otherwise, the data will be a string.

If `options` is a string, then it specifies the encoding.

When the `path` is a directory, the behavior of `fsPromises.readFile()` is
platform-specific. On macOS, Linux, and Windows, the promise will be rejected
with an error. On FreeBSD, a representation of the directory's contents will be
returned.

An example of reading a `package.json` file located in the same directory of the
running code:

```js
import { readFile } from 'node:fs/promises';
try {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
```

It is possible to abort an ongoing `readFile` using an `AbortSignal`. If a
request is aborted the promise returned is rejected with an `AbortError`:

```js
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```

Aborting an ongoing request does not abort individual operating
system requests but rather the internal buffering `fs.readFile` performs.

Any specified `FileHandle` has to support reading.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `PathLike` \| `FileHandle` | filename or `FileHandle` |
| `options`? | `null` \| \{\} & `Abortable` | - |

##### Returns

`Promise`\<`Buffer`\>

- A promise that resolves to the content of the file as a string or buffer.

Fulfills with the contents of the file.

##### Param

The path of the file to read.

##### Throws

If an error occurs while reading the file.

##### Example

```ts
import { readFile } from '@dovenv/utils'

try {
  const content = await readFile('./example.txt');
  console.log(content);
} catch (error) {
  console.error('Error reading file:', error);
}
```

##### Since

v10.0.0

#### readFile(path, options)

```ts
function readFile(path: PathLike | FileHandle, options: BufferEncoding | {} & Abortable): Promise<string>
```

Asynchronously reads the entire contents of a file.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `PathLike` \| `FileHandle` | A path to a file. If a URL is provided, it must use the `file:` protocol. If a `FileHandle` is provided, the underlying file will _not_ be closed automatically. |
| `options` | `BufferEncoding` \| \{\} & `Abortable` | An object that may contain an optional flag. If a flag is not provided, it defaults to `'r'`. |

##### Returns

`Promise`\<`string`\>

- A promise that resolves to the content of the file as a string or buffer.

##### Param

The path of the file to read.

##### Throws

If an error occurs while reading the file.

##### Example

```ts
import { readFile } from '@dovenv/utils'

try {
  const content = await readFile('./example.txt');
  console.log(content);
} catch (error) {
  console.error('Error reading file:', error);
}
```

#### readFile(path, options)

```ts
function readFile(path: PathLike | FileHandle, options?: null | BufferEncoding | ObjectEncodingOptions & Abortable & {}): Promise<string | Buffer>
```

Asynchronously reads the entire contents of a file.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `PathLike` \| `FileHandle` | A path to a file. If a URL is provided, it must use the `file:` protocol. If a `FileHandle` is provided, the underlying file will _not_ be closed automatically. |
| `options`? | `null` \| `BufferEncoding` \| `ObjectEncodingOptions` & `Abortable` & \{\} | An object that may contain an optional flag. If a flag is not provided, it defaults to `'r'`. |

##### Returns

`Promise`\<`string` \| `Buffer`\>

- A promise that resolves to the content of the file as a string or buffer.

##### Param

The path of the file to read.

##### Throws

If an error occurs while reading the file.

##### Example

```ts
import { readFile } from '@dovenv/utils'

try {
  const content = await readFile('./example.txt');
  console.log(content);
} catch (error) {
  console.error('Error reading file:', error);
}
```

***

### relativePath()

```ts
function relativePath(from: string, to: string): string
```

Solve the relative path from \{from\} to \{to\} based on the current working directory.
At times we have two absolute paths, and we need to derive the relative path from one to the other. This is actually the reverse transform of path.resolve.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `from` | `string` |
| `to` | `string` |

#### Returns

`string`

#### Throws

if either `from` or `to` is not a string.

***

### removeDir()

```ts
function removeDir(path: string): Promise<void>
```

Removes a directory and its contents if it exists.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path of the directory to remove. |

#### Returns

`Promise`\<`void`\>

#### Throws

If an error occurs while removing the directory.

#### Example

```ts
import { removeDir } from '@dovenv/utils'

try {
  await removeDir('./my/path')
} catch (e) {
  console.log(e)
}
```

***

### removeDirIfExist()

```ts
function removeDirIfExist(path: string): Promise<void>
```

Removes a directory and its contents if it exists.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path of the directory to remove. |

#### Returns

`Promise`\<`void`\>

#### Throws

If an error occurs while removing the directory.

#### Example

```ts
import { removeDirIfExist } from '@dovenv/utils'

await removeDirIfExist('./my/path')
```

***

### removeFile()

```ts
function removeFile(path: string): Promise<void>
```

Removes a file.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path of the file to remove. |

#### Returns

`Promise`\<`void`\>

#### Throws

If an error occurs while removing the file.

#### Example

```ts
try {
  await removeFile('./my/path')
} catch (e) {
  console.log(e)
}
```

***

### removeFileIfExist()

```ts
function removeFileIfExist(path: string): Promise<void>
```

Removes a file if it exists.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path of the file to remove. |

#### Returns

`Promise`\<`void`\>

#### Throws

If an error occurs while removing the file.

#### Example

```ts
try {
  await removeFile('./my/path')
} catch (e) {
  console.log(e)
}
```

***

### removePathIfExist()

```ts
function removePathIfExist(path: string): Promise<void>
```

Removes a file or directory if it exists.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path of the file or directory to remove. |

#### Returns

`Promise`\<`void`\>

#### Throws

If an error occurs while removing the file or directory.

#### Example

```ts
try {
  await removePathIfExist('./my/path')
} catch (e) {
  console.log(e)
}
```

***

### replaceConsole()

```ts
function replaceConsole(opts: {
  params: Record<string, string>;
  transform: (opts: {
     data: string;
     type: ConsoleType;
    }) => string;
  type: Prettify<ConsoleType | ConsoleType[]>;
 }): {
  start: () => void;
  stop: () => void;
}
```

Replaces values in console output using a set of parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `object` | Options for the console output replacer. |
| `opts.params` | `Record`\<`string`, `string`\> | Params object containing key-value pairs where each key is a string to be replaced by its corresponding value in the output. **Example** `{ 	 * 'error': 'warning' 	 * }` |
| `opts.transform`? | (`opts`: \{ `data`: `string`; `type`: `ConsoleType`; \}) => `string` | Function to transform the output before replacing it. **Example** `const transform = ( { data, type } ) => { return type === 'warm' ? data.toUpperCase() : data }` |
| `opts.type`? | [`Prettify`](#prettifyt)\<ConsoleType \| ConsoleType\[\]\> | Type of stream to replace output in. **Default** `'log'` |

#### Returns

```ts
{
  start: () => void;
  stop: () => void;
}
```

A Object with `start` and `stop` methods.

| Name | Type |
| ------ | ------ |
| `start` | () => `void` |
| `stop` | () => `void` |

#### Example

```ts
import { replaceConsole } from '@dovenv/utils'
const versionOut = replaceConsole({
  params: {
    'v1.3.4': 'v2.1.9'
  },
  type: ['stderr']
});

versionOut.start();
// mys code
versionOut.stop();
```

***

### replacePlaceholders()

```ts
function replacePlaceholders(props: Props): Promise<string>
```

Replace placeholders in a string with their corresponding values.

The function takes a string with placeholders, an object with parameter values,
and an optional custom parameter function.

The function returns a Promise that resolves to the string with all placeholders
replaced.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `Props` | Props for the function. |

#### Returns

`Promise`\<`string`\>

- A Promise that resolves to the string with all placeholders replaced.

***

### replaceStd()

```ts
function replaceStd(opts: {
  params: Record<string, string>;
  process: Process;
  transform: (opts: {
     data: string;
     type: StdType;
    }) => string;
  type: Prettify<StdType | StdType[]>;
 }): {
  start: () => void;
  stop: () => void;
}
```

Replaces output in the specified stream (stdout, stderr, or stdin) by substituting
values based on the provided parameters.

This function overrides the write method of the specified stream to replace occurrences
of specified strings in the output with replacement strings. It supports custom process
objects and stream types.

---

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `object` | The options for replacing output. |
| `opts.params` | `Record`\<`string`, `string`\> | Params object containing key-value pairs where each key is a string to be replaced by its corresponding value in the output. **Example** `{ 	 * 'error': 'warning' 	 * }` |
| `opts.process`? | `Process` | processs object to replace output in. **Default** `process` |
| `opts.transform`? | (`opts`: \{ `data`: `string`; `type`: `StdType`; \}) => `string` | Function to transform the output before replacing it. **Example** `const transform = ( { data, type } ) => { return type === 'stderr' ? data.toUpperCase() : data }` |
| `opts.type`? | [`Prettify`](#prettifyt)\<StdType \| StdType\[\]\> | Type of stream to replace output in. **Default** `'stdout'` |

#### Returns

```ts
{
  start: () => void;
  stop: () => void;
}
```

A Object with `start` and `stop` methods.

| Name | Type |
| ------ | ------ |
| `start` | () => `void` |
| `stop` | () => `void` |

#### Example

```ts
import { replaceConsole } from '@dovenv/utils'
const versionOut = replaceStd({
  params: {
    'v1.3.4': 'v2.1.9'
  },
  type: ['stderr']
});

versionOut.start();
// my code
versionOut.stop();
```

***

### resolvePath()

```ts
function resolvePath(...paths: string[]): string
```

The right-most parameter is considered \{to\}. Other parameters are considered an array of \{from\}.

Starting from leftmost \{from\} parameter, resolves \{to\} to an absolute path.

If \{to\} isn't already absolute, \{from\} arguments are prepended in right to left order,
until an absolute path is found. If after using all \{from\} paths still no absolute path is found,
the current working directory is used as well. The resulting path is normalized,
and trailing slashes are removed unless the path gets resolved to the root directory.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`paths` | `string`[] | A sequence of paths or path segments. |

#### Returns

`string`

#### Throws

if any of the arguments is not a string.

***

### rmDeprecationAlerts()

```ts
function rmDeprecationAlerts(): void
```

Suppresses deprecation warnings in the process.

This function sets the `process.noDeprecation` property to `true`,

Note: This is not recommended for production environments, as it might
hide useful deprecation warnings that should be addressed.

#### Returns

`void`

***

### runLocalNodeBin()

```ts
function runLocalNodeBin(options: {
  args: string[];
  name: string;
  opts: EnvOptions;
}): Promise<number>
```

Runs a local Node binary in the current project.

It uses the `PATH` and `npm-run-path` to locate the binary in the project's `node_modules/.bin`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `object` | Options object. |
| `options.args`? | `string`[] | Args to pass to the bin. |
| `options.name` | `string` | Name of the bin to run. |
| `options.opts`? | `EnvOptions` | Options object. |

#### Returns

`Promise`\<`number`\>

- Resolves with the exit code of the bin.

#### Throws

- If the bin exits with a non-zero code.

***

### schema2object()

```ts
function schema2object<R>(schema: string): R
```

Parses a JSON schema string into an object.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `R` *extends* `object` | The type of the object to be returned. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `schema` | `string` | The JSON schema string to parse. |

#### Returns

`R`

- The parsed object.

#### Throws

- If the input string is not a valid JSON.

#### Example

```ts
const obj = schema2object<{ foo: string }>('{"foo": "bar"}');
console.log(obj.foo); // Output: "bar"
```

***

### schema2ts()

```ts
function schema2ts(params: Schema2tsProps): Promise<string>
```

JSON schema to typescript type string

Useful, for example, to display a schema in a readable way for the user.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `Schema2tsProps` | Options. |

#### Returns

`Promise`\<`string`\>

---

#### Example

```ts
const tsString = await schema2ts({
  name: 'MySchemaType',
  schema: {
    type: "object",
    ...
  }
})

console.log(tsString)
```

***

### schema2type()

```ts
function schema2type(params: Schema2typeProps): Promise<string>
```

Converts a JSON schema to a TypeScript type string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `Schema2typeProps` | Options for conversion. |

#### Returns

`Promise`\<`string`\>

- The TypeScript type string representation of the schema.
---

#### Example

```ts
const typeString = await schema2type({
  schema: {
    type: "object",
    ...
  },
  required: true,
  noUnknownObject: false
});

console.log(typeString);
```

***

### schema2zod()

```ts
function schema2zod(params: Schema2zod): Promise<string>
```

JSON schema to zod type

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `Schema2zod` | Options. |

#### Returns

`Promise`\<`string`\>

- zodtype in string

#### Example

```ts
const zodSchema = await schema2zod({
  schema: {
    type: "object",
    ...
  }
})

console.log(zodSchema)
```

***

### serializeValidation()

```ts
function serializeValidation<T>(schema: T, opts?: Partial<ZerializerOptions>): Zerialize<T>
```

Serializes and simplifies types into a JSON format

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `ZodTypes` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `schema` | `T` |
| `opts`? | `Partial`\<`ZerializerOptions`\> |

#### Returns

`Zerialize`\<`T`\>

#### See

https://www.npmjs.com/package/zodex?activeTab=readme

***

### setDirTree()

```ts
function setDirTree(opts: SetDirTree): string
```

Returns a string representing the content of an object as a directory structure.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `SetDirTree` | An object with options for generating the directory structure string. |

#### Returns

`string`

A string representing the content of `structure` as a directory structure.

---

#### Example

```ts
const result = setDirTree({
  structure: {
  src: {
    components: {
      "Button.js": null,
      "Header.js": null
    },
    utils: {
      "helpers.js": null
    },
    "index.js": null
  },
  "package.json": null
  },
  name: "my-project",
});

console.log(result);
```

***

### spinner()

```ts
function spinner(options?: string | Options): Ora
```

Elegant terminal spinner.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options`? | `string` \| `Options` | If a string is provided, it is treated as a shortcut for `options.text`. |

#### Returns

`Ora`

#### Example

```
import ora from 'ora';

const spinner = ora('Loading unicorns').start();

setTimeout(() => {
	spinner.color = 'yellow';
	spinner.text = 'Loading rainbows';
}, 1000);
```

***

### svg2ascii()

```ts
function svg2ascii(params: {
  c_ratio: number;
  chars: string;
  color: boolean;
  fit:   | "box"
     | "width"
     | "none"
     | "height"
     | "original";
  height: string | number;
  input: IconDefinition | MediaInput;
  svgOptions: Svg2ImgCoreProps;
  width: string | number;
}): Promise<string>
```

Converts an SVG to ASCII art.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` | Parameters for the conversion. |
| `params.c_ratio`? | `number` | Since a monospace character is taller than it is wide, this property defines the integer approximation of the ratio of the width to height. You probably don't need to change this. **Default** `2` |
| `params.chars`? | `string` | The characters to use for the asciified image. **Default** ` .,:;i1tfLCG08@` |
| `params.color`? | `boolean` | Defines if the output should be colored (`true`) or black and white (`false`) **Default** `true` |
| `params.fit`? | \| `"box"` \| `"width"` \| `"none"` \| `"height"` \| `"original"` | The fit to resize the image to: • `box` - Resize the image such that it fits inside a bounding box defined by the specified width and height. Maintains aspect ratio. • `width` - Resize the image by scaling the width to the specified width. Maintains aspect ratio. • `height` - Resize the image by scaling the height to the specified height. Maintains aspect ratio. • `original` - Doesn't resize the image. • `none` - Scales the width and height to the specified values, ignoring original aspect ratio. **Default** `box` |
| `params.height`? | `string` \| `number` | The height to resize the image to. Use a percentage to set the image width to x% of the terminal window height. **Default** `100%` |
| `params.input` | `IconDefinition` \| `MediaInput` | Input to the media PATH, URL, STRING, BUFFER or IconDefinition (FONTAWESOME). |
| `params.svgOptions`? | `Svg2ImgCoreProps` | Svg options. |
| `params.width`? | `string` \| `number` | The width to resize the image to. Use a percentage to set the image width to x% of the terminal window width. **Default** `100%` |

#### Returns

`Promise`\<`string`\>

- Promise that resolves to the ASCII representation of the SVG.

#### Examples

```ts
// simple use with string
const svg = `<svg width="100" height="100">
  <rect width="100%" height="100%" fill="red" />
</svg>`
const ascii = await svg2ascii( { input: svg } )
console.log( ascii )
```

```ts
// simple use with url
const svg = `https://my-web.com/my-svg-code.svg`
const ascii = await svg2ascii( { input: svg } )
console.log( ascii )
```

```ts
// simple use with path
const svg = `./my-svg-path.svg`
const ascii = await svg2ascii( { input: svg } )
console.log( ascii )
```

***

### svg2imageBuffer()

```ts
function svg2imageBuffer(params: {
  input: IconDefinition | MediaInput;
  svgOptions: Svg2ImgCoreProps;
}): Promise<Buffer<ArrayBufferLike>>
```

Converts an SVG to an image buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` | Parameters for the conversion. |
| `params.input` | `IconDefinition` \| `MediaInput` | Input to the media PATH, URL, STRING, BUFFER or IconDefinition (FONTAWESOME). |
| `params.svgOptions`? | `Svg2ImgCoreProps` | Svg options. |

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

- A promise that resolves to the image buffer.

***

### svg2terminal()

```ts
function svg2terminal(params: {
  asciiOptions: {
     c_ratio: number;
     chars: string;
     color: boolean;
     fit:   | "box"
        | "width"
        | "none"
        | "height"
        | "original";
    };
  asciiOutput: boolean;
  height: string | number;
  input: IconDefinition | MediaInput;
  preserveAspectRatio: boolean;
  svgOptions: Svg2ImgCoreProps;
  width: string | number;
}): Promise<string>
```

Convert SVG to image string for terminal display.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` | Options object. |
| `params.asciiOptions`? | `object` | Options for asciiOutput. |
| `params.asciiOptions.c_ratio`? | `number` | Since a monospace character is taller than it is wide, this property defines the integer approximation of the ratio of the width to height. You probably don't need to change this. **Default** `2` |
| `params.asciiOptions.chars`? | `string` | The characters to use for the asciified image. **Default** ` .,:;i1tfLCG08@` |
| `params.asciiOptions.color`? | `boolean` | Defines if the output should be colored (`true`) or black and white (`false`) **Default** `true` |
| `params.asciiOptions.fit`? | \| `"box"` \| `"width"` \| `"none"` \| `"height"` \| `"original"` | The fit to resize the image to: • `box` - Resize the image such that it fits inside a bounding box defined by the specified width and height. Maintains aspect ratio. • `width` - Resize the image by scaling the width to the specified width. Maintains aspect ratio. • `height` - Resize the image by scaling the height to the specified height. Maintains aspect ratio. • `original` - Doesn't resize the image. • `none` - Scales the width and height to the specified values, ignoring original aspect ratio. **Default** `box` |
| `params.asciiOutput`? | `boolean` | Enable a ascii output. **Default** `false` |
| `params.height`? | `string` \| `number` | Custom image height. Can be set as percentage or number of rows of the terminal. It is recommended to use the percentage options. |
| `params.input` | `IconDefinition` \| `MediaInput` | Input to the media PATH, URL, STRING, BUFFER or IconDefinition (FONTAWESOME). |
| `params.preserveAspectRatio`? | `boolean` | If false, the aspect ratio will not be preserved . **Default** `true` |
| `params.svgOptions`? | `Svg2ImgCoreProps` | Svg options. |
| `params.width`? | `string` \| `number` | Custom image width. Can be set as percentage or number of columns of the terminal. It is recommended to use the percentage options. |

#### Returns

`Promise`\<`string`\>

- Image buffer.

#### Examples

```ts
// simple use with string
const svg = `<svg width="100" height="100">
  <rect width="100%" height="100%" fill="red" />
</svg>`
const output = await svg2terminal( { input: svg } )
console.log( output )
```

```ts
// simple use with url
const svg = `https://my-web.com/my-svg-code.svg`
const output = await svg2terminal( { input: svg } )
console.log( output )
```

```ts
// simple use with path
const svg = `./my-svg-path.svg`
const output = await svg2terminal( { input: svg } )
console.log( output )
```

***

### table()

```ts
function table(data: TableData, options?: TableUserConfig): string
```

Generates a text-based table from the provided data array.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | [`TableData`](#tabledata) | The data to display in the table. |
| `options`? | `TableUserConfig` | Optional configuration options for the table. |

#### Returns

`string`

- The text-based table.

#### See

https://www.npmjs.com/package/table

#### Example

```ts
const data = [
    ['Name', 'Age', 'Country'],
    ['John', 30, 'USA'],
    ['Alice', 25, 'UK'],
    ['Bob', 35, 'Canada'],
];
const tableText = table(data);
console.log(tableText);
```

***

### text2image()

```ts
function text2image(params: Text2ImageProps): Promise<Buffer<ArrayBufferLike>>
```

Converts text to an image.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`Text2ImageProps`](#text2imageprops) | Parameters to convert text to image. |

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

The image buffer.

#### Example

```ts
const buffer = await text2image( {
  input : 'Hello world!',
  fontSize : 42,
  backgroundColor : '#fff',
} )
```

***

### ts2schema()

```ts
function ts2schema(params: Ts2Schema): Promise<SchemaObject>
```

Converts a TypeScript type to a JSON schema.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `Ts2Schema` | Options. |

#### Returns

`Promise`\<`SchemaObject`\>

The JSON schema.

#### Example

```ts
const jsonSchema = await ts2schema({
  config: {
    path: 'path/to/MyType.ts',
    type: 'MyType',
  },
})

console.log(jsonSchema)
```

***

### validateHomeDir()

```ts
function validateHomeDir(path: string): string
```

Validates and resolves a path with home directory replacement.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path to validate and resolve. |

#### Returns

`string`

- The validated and resolved absolute path.

#### Example

```ts
import { validateHomeDir } from '@dovenv/utils'

const path = validateHomeDir('~/Documents')

console.log(path) // returns: /users/{username}/Documents

const path = validateHomeDir('/Home')

console.log(path) // returns same: /Home
```

***

### validateSchema()

```ts
function validateSchema(data: string | object, schema: string | object): Promise<object>
```

Validate a data from a schema.

This function accepts both `data` and `schema` as required parameters, which can either be
an object or a string. If a string is provided, it may represent a file path or a URL, and
the format can be one of the following: JSON, YAML, TOML, JS, INI, CSV, or XML.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `string` \| `object` | The data to be validated. It can be a string representing a file path or URL, or an object containing the data to validate. |
| `schema` | `string` \| `object` | The schema against which the data will be validated. It can be a string representing a file path or URL, or an object representing the schema. |

#### Returns

`Promise`\<`object`\>

- The validated JSON data.

#### Throws

- If the schema is invalid or the data does not conform to the schema.

#### Example

```ts
import { validateSchema } from '@dovenv/utils'

try {
  const validData = await validateSchema(
    '../../package.json',
    'https://json.schemastore.org/package.json'
  );
  console.log(validData);
} catch (error) {
    console.error('Validation failed:', error.message);
}
```

***

### writeFile()

```ts
function writeFile(
   file: PathLike | FileHandle, 
   data: 
  | string
  | Stream
  | ArrayBufferView<ArrayBufferLike>
  | Iterable<string | ArrayBufferView<ArrayBufferLike>, any, any>
  | AsyncIterable<string | ArrayBufferView<ArrayBufferLike>, any, any>, 
options?: null | BufferEncoding | ObjectEncodingOptions & {} & Abortable): Promise<void>
```

Asynchronously writes data to a file, replacing the file if it already exists. `data` can be a string, a buffer, an
[AsyncIterable](https://tc39.github.io/ecma262/#sec-asynciterable-interface), or an
[Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) object.

The `encoding` option is ignored if `data` is a buffer.

If `options` is a string, then it specifies the encoding.

The `mode` option only affects the newly created file. See `fs.open()` for more details.

Any specified `FileHandle` has to support writing.

It is unsafe to use `fsPromises.writeFile()` multiple times on the same file
without waiting for the promise to be settled.

Similarly to `fsPromises.readFile` \- `fsPromises.writeFile` is a convenience
method that performs multiple `write` calls internally to write the buffer
passed to it. For performance sensitive code consider using `fs.createWriteStream()` or `filehandle.createWriteStream()`.

It is possible to use an `AbortSignal` to cancel an `fsPromises.writeFile()`.
Cancelation is "best effort", and some amount of data is likely still
to be written.

```js
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```

Aborting an ongoing request does not abort individual operating
system requests but rather the internal buffering `fs.writeFile` performs.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `file` | `PathLike` \| `FileHandle` | filename or `FileHandle` |
| `data` | \| `string` \| `Stream` \| `ArrayBufferView`\<`ArrayBufferLike`\> \| `Iterable`\<string \| ArrayBufferView\<ArrayBufferLike\>, `any`, `any`\> \| `AsyncIterable`\<string \| ArrayBufferView\<ArrayBufferLike\>, `any`, `any`\> | - |
| `options`? | `null` \| `BufferEncoding` \| `ObjectEncodingOptions` & \{\} & `Abortable` | - |

#### Returns

`Promise`\<`void`\>

Fulfills with `undefined` upon success.

#### Since

v10.0.0

***

### writeFileContent()

```ts
function writeFileContent(path: string, content: string | Buffer<ArrayBufferLike>): Promise<void>
```

Writes content to a file at the specified path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path of the file to write to. |
| `content` | `string` \| `Buffer`\<`ArrayBufferLike`\> | The content to write to the file. |

#### Returns

`Promise`\<`void`\>

#### Throws

If an error occurs while writing to the file.

#### Example

```ts
import { writeFileContent } from '@dovenv/utils'

await writeFileContent('./greetFile.txt', 'Hello')
```

***

### writeImageFromBase64()

```ts
function writeImageFromBase64(opts: {
  input: string;
  output: string;
}): Promise<void>
```

Writes a base64-encoded image to a file.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `object` | The options object containing the input and output file paths. |
| `opts.input` | `string` | - |
| `opts.output` | `string` | - |

#### Returns

`Promise`\<`void`\>

- A promise that resolves when the file has been written.

***

### zipFile()

```ts
function zipFile(options: ZipFileOptions): Promise<void>
```

Zips the specified file and saves it to the output directory.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `ZipFileOptions` | An object with properties. |

#### Returns

`Promise`\<`void`\>

***

### zipFilesInDirectory()

```ts
function zipFilesInDirectory(options: ZipDirOptions): Promise<void>
```

Zips the files in the specified source directory and saves them to the output directory.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `ZipDirOptions` | An object with properties. |

#### Returns

`Promise`\<`void`\>

***

### zod2schema()

```ts
function zod2schema(params: Zod2schema): Promise<JsonSchema7Type & {}>
```

Converts a zod schema to a JSON schema.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `Zod2schema` | Options. |

#### Returns

`Promise`\<`JsonSchema7Type` & \{\}\>

The JSON schema.

#### Example

```ts
const jsonSchema = await zod2schema({
  schema: z.object({
    foo: z.string(),
  }),
  opts: {
    // zodToJsonSchema options
  },
})
```

## Type Aliases

### Any

```ts
type Any: any;
```

Any type
Same as `any` type. Used only for prevent ts errors

***

### AnyArray

```ts
type AnyArray: any[];
```

Any Array type
Same as `any[]` type. Used only for prevent ts errors

***

### AssertEqual\<T, U\>

```ts
type AssertEqual<T, U>: <V>() => V extends T ? 1 : 2 extends <V>() => V extends U ? 1 : 2 ? true : false;
```

AssertEqual

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `U` |

#### Description

Checks if two types `T` and `U` are equal.

#### Example

```ts
type Test = AssertEqual<string, string>; // Expected: true
  type TestFail = AssertEqual<string, number>; // Expected: false
```

***

### BoxOpts

```ts
type BoxOpts: Options;
```

***

### BoxParams

```ts
type BoxParams: Parameters<typeof box>;
```

Parameters of the `box` function from the `@dovenv/utils` module.

[See module](https://clippo.pigeonposse.com/guide/utils/styles#box).

***

### ColumnData

```ts
type ColumnData: Record<string, unknown> | Record<string, unknown>[];
```

***

### ColumnOpts

```ts
type ColumnOpts: columnify.GlobalOptions;
```

***

### ColumnsParams

```ts
type ColumnsParams: Parameters<typeof columns>;
```

Parameters of the `columns` function from the `@dovenv/utils` module.

[See module](https://clippo.pigeonposse.com/guide/utils/styles#columns).

***

### DeepNonNullable\<T\>

```ts
type DeepNonNullable<T>: Prettify<_DeepNonNullable<T>>;
```

DeepNonNullable

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Description

NonNullable that works for deeply nested structure

#### Example

```ts
type NestedProps = {
    first?: null | {
      second?: null | {
        name?: string | null |
        undefined;
      };
    };
  };
  type RequiredNestedProps = DeepNonNullable<NestedProps>;
  // Expect: {
  //   first: {
  //     second: {
  //       name: string;
  //     };
  //   };
  // }
```

***

### DeepPartial\<T\>

```ts
type DeepPartial<T>: T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
```

DeepPartial

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

***

### DeepRequired\<T\>

```ts
type DeepRequired<T>: Prettify<_DeepRequired<T>>;
```

DeepRequired

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Description

Required that works for deeply nested structure

#### Example

```ts
type NestedProps = {
    first?: {
      second?: {
        name?: string;
      };
    };
  };
  type RequiredNestedProps = DeepRequired<NestedProps>
  // Expect: {
  //   first: {
  //     second: {
  //       name: string;
  //     };
  //   };
  // }
```

***

### ExpectEqual\<T, U\>

```ts
type ExpectEqual<T, U>: AssertEqual<T, U> extends true ? T : never;
```

ExpectEqual

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `U` |

#### Description

Returns the type `T` if `T` and `U` are equal; otherwise, returns `never`.

#### Example

```ts
type Test = ExpectEqual<string, string>; // Expected: string
  type TestFail = ExpectEqual<string, number>; // Expected: never
```

***

### Fonts

```ts
type Fonts: figlet.Fonts;
```

***

### FunctionKeys\<T\>

```ts
type FunctionKeys<T>: { [K in keyof T]-?: NonUndefined<T[K]> extends Function ? K : never }[keyof T];
```

FunctionKeys

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |

#### Description

Get union type of keys that are functions in object type `T`

#### Example

```ts
type MixedProps = {name: string; setName: (name: string) => void; someKeys?: string; someFn?: (...args: any) => any;};

  // Expect: "setName | someFn"
  type Keys = FunctionKeys<MixedProps>;
```

***

### Gif2AsciiArrayProps

```ts
type Gif2AsciiArrayProps: Prettify<MediaSharedProps & Omit<AsciifyOptions, "input">>;
```

***

### Gif2AsciiProps

```ts
type Gif2AsciiProps: Prettify<Gif2AsciiArrayProps & {
  animate: Omit<AnimateProps, "frames">;
}>;
```

***

### Gif2ImagesProps

```ts
type Gif2ImagesProps: Prettify<MediaSharedProps>;
```

***

### GifProps

```ts
type GifProps: Prettify<MediaSharedProps & Exclude<GifOptions, undefined> & AsciiOpts>;
```

***

### GradientColors

```ts
type GradientColors: string[] | {
  color: string;
  pos: number;
 }[];
```

***

### GradientOpts

```ts
type GradientOpts: {
  hsvSpin: "short" | "long";
  interpolation: "rgb" | "hsv";
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `hsvSpin`? | `"short"` \| `"long"` | Used only in the case of HSV interpolation. Because hue can be considered as a circle, there are two ways to go from a color to another color. HsvSpin can be either short or long, depending on if you want to take the shortest or the longest way between two colors. Defaults to short. Case insensitive. |
| `interpolation`? | `"rgb"` \| `"hsv"` | The gradient can be generated using RGB or HSV interpolation. HSV usually produces brighter colors. Interpolation can be set to rgb for RGB interpolation, orhsv for HSV interpolation. Defaults to rgb. Case insentitive. |

***

### HighlightOpts

```ts
type HighlightOpts: Parameters<typeof highlight>[1];
```

***

### Image2AsciiProps

```ts
type Image2AsciiProps: MediaSharedProps & AsciifyOptions;
```

***

### ImageProps

```ts
type ImageProps: MediaSharedProps & ImageParams & AsciiOpts;
```

***

### NonFunctionKeys\<T\>

```ts
type NonFunctionKeys<T>: { [K in keyof T]-?: NonUndefined<T[K]> extends Function ? never : K }[keyof T];
```

NonFunctionKeys

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |

#### Description

Get union type of keys that are non-functions in object type `T`

#### Example

```ts
type MixedProps = {name: string; setName: (name: string) => void; someKeys?: string; someFn?: (...args: any) => any;};

  // Expect: "name | someKey"
  type Keys = NonFunctionKeys<MixedProps>;
```

***

### NonUndefined\<A\>

```ts
type NonUndefined<A>: A extends undefined ? never : A;
```

NonUndefined

#### Type Parameters

| Type Parameter |
| ------ |
| `A` |

#### Description

Exclude undefined from set `A`

#### Example

```ts
// Expect: "string | null"
  SymmetricDifference<string | null | undefined>;
```

***

### NumberParams

```ts
type NumberParams: p.TextOptions & {
  defaultValue: number;
  errorText: string;
  placeholder: number;
};
```

NUMBER.

#### Type declaration

| Name | Type |
| ------ | ------ |
| `defaultValue`? | `number` |
| `errorText`? | `string` |
| `placeholder`? | `number` |

***

### ObjectKeys\<Values\>

```ts
type ObjectKeys<Values>: keyof Values;
```

Keys of Object

#### Type Parameters

| Type Parameter |
| ------ |
| `Values` |

***

### ObjectValues\<Values\>

```ts
type ObjectValues<Values>: Values[keyof Values];
```

Values of Object

#### Type Parameters

| Type Parameter |
| ------ |
| `Values` |

***

### PackageJSON

```ts
type PackageJSON: JSONSchemaForNPMPackageJsonFiles;
```

***

### Prettify\<T\>

```ts
type Prettify<T>: { [K in keyof T]: T[K] } & {};
```

Prettify your type for better readability

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

***

### PromptLineCancelProps

```ts
type PromptLineCancelProps: typeof p & {
  box: (opts: {
     opts: BoxParams[1];
     type: PromptLineMethod;
     value: BoxParams[0];
    }) => void;
  columns: (opts: {
     opts: ColumnsParams[1];
     type: PromptLineMethod;
     value: ColumnsParams[0];
    }) => void;
  number: typeof number;
  table: (opts: {
     opts: TableParams[1];
     type: PromptLineMethod;
     value: TableParams[0];
    }) => void;
};
```

Props for canceling a prompt line, including functions from various modules.

#### Type declaration

| Name | Type |
| ------ | ------ |
| `box` | (`opts`: \{ `opts`: [`BoxParams`](#boxparams)\[`1`\]; `type`: [`PromptLineMethod`](#promptlinemethod); `value`: [`BoxParams`](#boxparams)\[`0`\]; \}) => `void` |
| `columns` | (`opts`: \{ `opts`: [`ColumnsParams`](#columnsparams)\[`1`\]; `type`: [`PromptLineMethod`](#promptlinemethod); `value`: [`ColumnsParams`](#columnsparams)\[`0`\]; \}) => `void` |
| `number` | *typeof* `number` |
| `table` | (`opts`: \{ `opts`: [`TableParams`](#tableparams)\[`1`\]; `type`: [`PromptLineMethod`](#promptlinemethod); `value`: [`TableParams`](#tableparams)\[`0`\]; \}) => `void` |

***

### PromptLineMethod

```ts
type PromptLineMethod: typeof promptLineMethods[keyof typeof promptLineMethods];
```

***

### PromptLineParams\<T\>

```ts
type PromptLineParams<T>: {
  intro: string;
  list: (prompt: PromptLineExecProps) => p.PromptGroup<T> | Promise<p.PromptGroup<T>>;
  onCancel: (prompt: PromptLineCancelProps) => Promise<void>;
  outro: string;
};
```

Parameters for configuring a prompt line.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Type declaration

| Name | Type |
| ------ | ------ |
| `intro`? | `string` |
| `list` | (`prompt`: `PromptLineExecProps`) => `p.PromptGroup`\<`T`\> \| `Promise`\<`p.PromptGroup`\<`T`\>\> |
| `onCancel`? | (`prompt`: [`PromptLineCancelProps`](#promptlinecancelprops)) => `Promise`\<`void`\> |
| `outro`? | `string` |

***

### PromptParams

```ts
type PromptParams: Parameters<typeof Enquirer.prompt>[0];
```

***

### QRcodeOpts

```ts
type QRcodeOpts: {
  small: boolean;
};
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `small` | `boolean` |

***

### ReturnAwaitedType\<T\>

```ts
type ReturnAwaitedType<T>: Awaited<ReturnType<T>>;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* (...`args`: [`Any`](#any)) => [`Any`](#any) |

***

### Svg2AsciiProps

```ts
type Svg2AsciiProps: Prettify<SvgSharedProps & Omit<AsciifyOptions, "input">>;
```

***

### Svg2ImageProps

```ts
type Svg2ImageProps: Prettify<SvgSharedProps>;
```

***

### SvgProps

```ts
type SvgProps: Prettify<SvgSharedProps & Omit<ImageProps, "input">>;
```

***

### TableData

```ts
type TableData: unknown[][];
```

***

### TableOpts

```ts
type TableOpts: TableUserConfig;
```

***

### TableParams

```ts
type TableParams: Parameters<typeof table>;
```

Parameters of the `table` function from the `@dovenv/utils` module.

[See module](https://clippo.pigeonposse.com/guide/utils/style#table).

***

### Text2ImageProps

```ts
type Text2ImageProps: {
  input: string;
} & Partial<IOptions>;
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `input` | `string` |

***

### Validate

```ts
type Validate: typeof z;
```

****************************************************************************
TYPES
****************************************************************************

***

### ValidateAnyType

```ts
type ValidateAnyType: ZodType<any, any, any>;
```

***

### ValidateErrorType

```ts
type ValidateErrorType: ZodError;
```

***

### ValidateInfer\<O\>

```ts
type ValidateInfer<O>: z.infer<O>;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `O` *extends* [`ValidateAnyType`](#validateanytype) |

***

### ValidateType\<T\>

```ts
type ValidateType<T>: ZodType<T>;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Variables

### colorConversion

```ts
const colorConversion: {
  hex2rgb: hexToRgb;
  hslToRgb: hslToRgb;
  rgb2CIELab: rgbToCIELab;
  rgb2hex: rgbToHex;
  rgb2sl: rgbToHsl;
  rgb2xyz: rgbToXyz;
  xyz2CIELab: xyzToCIELab;
};
```

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `hex2rgb` | (`hex`: `string`) => `Vec3` | hexToRgb |
| `hslToRgb` | (`h`: `number`, `s`: `number`, `l`: `number`) => `Vec3` | hslToRgb |
| `rgb2CIELab` | (`r`: `number`, `g`: `number`, `b`: `number`) => `Vec3` | rgbToCIELab |
| `rgb2hex` | (`r`: `number`, `g`: `number`, `b`: `number`) => `string` | rgbToHex |
| `rgb2sl` | (`r`: `number`, `g`: `number`, `b`: `number`) => `Vec3` | rgbToHsl |
| `rgb2xyz` | (`r`: `number`, `g`: `number`, `b`: `number`) => `Vec3` | rgbToXyz |
| `xyz2CIELab` | (`x`: `number`, `y`: `number`, `z`: `number`) => `Vec3` | xyzToCIELab |

***

### csv

```ts
const csv: {
  deserialize: getObjectFromCSVContent;
  serialize: object2csv;
};
```

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `deserialize` | \<`Res`\>(`content`: `string`, `options`: `Options`) => `Promise`\<`Res`\> | getObjectFromCSVContent |
| `serialize` | \<`I`\>(`obj`: `I`, `options`?: `Options`) => `Promise`\<`string`\> | object2csv |

***

### icon

```ts
const icon: {} = figures;
```

Unicode symbols with fallbacks for older terminals.

#### See

https://github.com/sindresorhus/figures/blob/main/index.js

#### Example

```ts
console.log(
  icon.warning,
  icon.cross,
  icon.arrowDown,
  icon.bullet
)
```

***

### ini

```ts
const ini: {
  deserialize: getObjectFromINIContent;
  serialize: objectToINI;
};
```

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `deserialize` | \<`Res`\>(`content`: `string`) => `Promise`\<`Res`\> | getObjectFromINIContent |
| `serialize` | \<`I`\>(`obj`: `I`) => `Promise`\<`string`\> | objectToINI |

***

### isBrowser

```ts
const isBrowser: boolean;
```

#### See

https://www.npmjs.com/package/browser-or-node

***

### isBun

```ts
const isBun: boolean;
```

***

### isDeno

```ts
const isDeno: boolean;
```

***

### isJsDom

```ts
const isJsDom: boolean;
```

***

### isNode

```ts
const isNode: boolean;
```

***

### isWebWorker

```ts
const isWebWorker: boolean;
```

***

### json

```ts
const json: {
  deserialize: getObjectFromJSONContent;
  serialize: (content: object) => string;
};
```

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `deserialize` | \<`Res`\>(`content`: `string`) => `Promise`\<`Res`\> | getObjectFromJSONContent |
| `serialize` | (`content`: `object`) => `string` | - |

***

### logger

```ts
const logger: ConsolaInstance = consola;
```

***

### promptLine

```ts
const promptLine: {
  box: (opts: {
     opts: Options;
     type: PromptLineMethod;
     value: string;
    }) => void;
  columns: (opts: {
     opts: GlobalOptions;
     type: PromptLineMethod;
     value: ColumnData;
    }) => void;
  number: (opts: NumberParams) => Promise<string | symbol>;
  table: (opts: {
     opts: TableUserConfig;
     type: PromptLineMethod;
     value: TableData;
    }) => void;
};
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `box` | (`opts`: \{ `opts`: `Options`; `type`: [`PromptLineMethod`](#promptlinemethod); `value`: `string`; \}) => `void` |
| `columns` | (`opts`: \{ `opts`: `GlobalOptions`; `type`: [`PromptLineMethod`](#promptlinemethod); `value`: [`ColumnData`](#columndata); \}) => `void` |
| `number` | (`opts`: [`NumberParams`](#numberparams)) => `Promise`\<`string` \| `symbol`\> |
| `table` | (`opts`: \{ `opts`: `TableUserConfig`; `type`: [`PromptLineMethod`](#promptlinemethod); `value`: [`TableData`](#tabledata); \}) => `void` |

***

### promptLineCore

```ts
const promptLineCore: typeof p = p;
```

***

### promptLineMethods

```ts
const promptLineMethods: {
  error: 'error';
  info: 'info';
  message: 'message';
  step: 'step';
  success: 'success';
  warn: 'warn';
  warning: 'warning';
};
```

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `error` | `"error"` | 'error' |
| `info` | `"info"` | 'info' |
| `message` | `"message"` | 'message' |
| `step` | `"step"` | 'step' |
| `success` | `"success"` | 'success' |
| `warn` | `"warn"` | 'warn' |
| `warning` | `"warning"` | 'warning' |

***

### svg

```ts
const svg: {
  deserialize: _parse;
  serialize: _stringify;
};
```

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `deserialize` | (`input`: `string`, `options`?: `IParseOptions`) => `Promise`\<`INode`\> | \_parse |
| `serialize` | (`ast`: `INode`, `options`?: `IStringifyOptions`) => `string` | \_stringify |

***

### toml

```ts
const toml: {
  deserialize: getObjectFromTOMLContent;
  serialize: (content: object) => string;
};
```

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `deserialize` | \<`Res`\>(`content`: `string`) => `Promise`\<`Res`\> | getObjectFromTOMLContent |
| `serialize` | (`content`: `object`) => `string` | - |

***

### validate

```ts
const validate: __module = z;
```

Create schema validation from js.
The validation functions are a wrapper of `zod` functions.

#### See

https://zod.dev/

***

### ValidateError

```ts
const ValidateError: typeof ZodError = ZodError;
```

Validate error class.
The validation functions are a wrapper of `zod` functions.

#### See

https://zod.dev/

***

### xml

```ts
const xml: {
  deserialize: getObjectFromXMLContent;
  serialize: objectToXML;
};
```

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `deserialize` | \<`Res`\>(`content`: `string`) => `Promise`\<`Res`\> | getObjectFromXMLContent |
| `serialize` | \<`I`\>(`obj`: `I`) => `Promise`\<`any`\> | objectToXML |

***

### yaml

```ts
const yaml: {
  deserialize: getObjectFromYAMLContent;
  serialize: (content: object) => string;
};
```

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `deserialize` | \<`Res`\>(`content`: `string`) => `Promise`\<`Res`\> | getObjectFromYAMLContent |
| `serialize` | (`content`: `object`) => `string` | - |

## Namespaces

- [md](namespaces/md.md)
