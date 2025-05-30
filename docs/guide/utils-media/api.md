# `@dovenv/utils-media` - API documentation

## Functions

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

### createBadgeSVG()

```ts
function createBadgeSVG(data: Format): Promise<string>
```

Cheate shields.io SVGs.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `Format` | The format of the badge. |

#### Returns

`Promise`\<`string`\>

The SVG code.

#### See

https://www.npmjs.com/package/badge-maker

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
        | "height"
        | "original"
        | "none";
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
| `params.asciiOptions.color`? | `boolean` | Defines if the output should be colored (`true`) or black and white (`false`). **Default** `true` |
| `params.asciiOptions.fit`? | \| `"box"` \| `"width"` \| `"height"` \| `"original"` \| `"none"` | The fit to resize the image to: • `box` - Resize the image such that it fits inside a bounding box defined by the specified width and height. Maintains aspect ratio. • `width` - Resize the image by scaling the width to the specified width. Maintains aspect ratio. • `height` - Resize the image by scaling the height to the specified height. Maintains aspect ratio. • `original` - Doesn't resize the image. • `none` - Scales the width and height to the specified values, ignoring original aspect ratio. **Default** `box` |
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
     | "height"
     | "original"
     | "none";
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
| `params.color`? | `boolean` | Defines if the output should be colored (`true`) or black and white (`false`). **Default** `true` |
| `params.fit`? | \| `"box"` \| `"width"` \| `"height"` \| `"original"` \| `"none"` | The fit to resize the image to: • `box` - Resize the image such that it fits inside a bounding box defined by the specified width and height. Maintains aspect ratio. • `width` - Resize the image by scaling the width to the specified width. Maintains aspect ratio. • `height` - Resize the image by scaling the height to the specified height. Maintains aspect ratio. • `original` - Doesn't resize the image. • `none` - Scales the width and height to the specified values, ignoring original aspect ratio. **Default** `box` |
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
     | "height"
     | "original"
     | "none";
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
| `params.color`? | `boolean` | Defines if the output should be colored (`true`) or black and white (`false`). **Default** `true` |
| `params.fit`? | \| `"box"` \| `"width"` \| `"height"` \| `"original"` \| `"none"` | The fit to resize the image to: • `box` - Resize the image such that it fits inside a bounding box defined by the specified width and height. Maintains aspect ratio. • `width` - Resize the image by scaling the width to the specified width. Maintains aspect ratio. • `height` - Resize the image by scaling the height to the specified height. Maintains aspect ratio. • `original` - Doesn't resize the image. • `none` - Scales the width and height to the specified values, ignoring original aspect ratio. **Default** `box` |
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

### svg2ascii()

```ts
function svg2ascii(params: {
  c_ratio: number;
  chars: string;
  color: boolean;
  fit:   | "box"
     | "width"
     | "height"
     | "original"
     | "none";
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
| `params.color`? | `boolean` | Defines if the output should be colored (`true`) or black and white (`false`). **Default** `true` |
| `params.fit`? | \| `"box"` \| `"width"` \| `"height"` \| `"original"` \| `"none"` | The fit to resize the image to: • `box` - Resize the image such that it fits inside a bounding box defined by the specified width and height. Maintains aspect ratio. • `width` - Resize the image by scaling the width to the specified width. Maintains aspect ratio. • `height` - Resize the image by scaling the height to the specified height. Maintains aspect ratio. • `original` - Doesn't resize the image. • `none` - Scales the width and height to the specified values, ignoring original aspect ratio. **Default** `box` |
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
        | "height"
        | "original"
        | "none";
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
| `params.asciiOptions.color`? | `boolean` | Defines if the output should be colored (`true`) or black and white (`false`). **Default** `true` |
| `params.asciiOptions.fit`? | \| `"box"` \| `"width"` \| `"height"` \| `"original"` \| `"none"` | The fit to resize the image to: • `box` - Resize the image such that it fits inside a bounding box defined by the specified width and height. Maintains aspect ratio. • `width` - Resize the image by scaling the width to the specified width. Maintains aspect ratio. • `height` - Resize the image by scaling the height to the specified height. Maintains aspect ratio. • `original` - Doesn't resize the image. • `none` - Scales the width and height to the specified values, ignoring original aspect ratio. **Default** `box` |
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

## Type Aliases

### Gif2AsciiArrayProps

```ts
type Gif2AsciiArrayProps: Prettify<MediaSharedProps & Omit<AsciifyOptions, "input">>;
```

***

### Gif2AsciiProps

```ts
type Gif2AsciiProps: Prettify<Gif2AsciiArrayProps & {
  animate: Omit<Parameters<typeof animate>[0], "frames">;
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

## Variables

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
