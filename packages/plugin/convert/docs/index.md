# dovenv/convert

File and text converter in different formats.
`openapi2md`, `jsdoc2md`, `html2md`, `md2html`, `ts2md`, `ts2html`, etc

## 🔑 Installation

{{partial.installation}}

## 📈 Usage

```js twoslash
import { defineConfig } from '@dovenv/core'
import convertPlugin from '@dovenv/convert'

export default defineConfig(
 convertPlugin( {
 example_openapi : {
  type   : 'openapi2md',
  input  : 'https://raw.githubusercontent.com/Redocly/openapi-starter/refs/heads/main/openapi/openapi.yaml',
  output : 'build/openapi',
  opts   : { sort: true },
 },
 example_ts : {
  type   : 'ts2md',
  input  : 'src/main.ts',
  output : 'build/ts',
  opts   : { typedocMarkdown: { entryFileName: 'EXAMPLE_TS' } },
 },
}
) )
```

```bash
dovenv convert
```

### Specific key

```bash
dovenv convert -k [key]
```

### Pattern key

```bash
dovenv convert -k "example-*"
```

```bash
dovenv convert -k "!*-openapi"
```
