# DOVENV - Contruye un entorno de trabajo robusto y facil de transportar

```js
import {defineConfig, mergeConfig} from 'dovenv'
import monorepoConfig from '@dovenv/env-monorepo' // add vitest, binarium, vite and playwright to dovenv. checks that docs folder exists

const projectConfig = defineConfig({
 docs: {
  downloads: {

  }
 }
})
export default mergeConfig([
  monorepoConfig,
  projectConfig,
])
```

## CLI

Aqui se listan todas los comandos de nuestro cli

## checks (`checks`)

- **paths**: Chequear si existe un directorio o un archivo.
- **validate**: Añade validación de esquemas para archivos JSON, TOML o YAML de tu proyecto. Esto ayuda a asegurar que a tus archivos como `package.json` no les falten campos importantes, como descripción, versión u otras variables esenciales antes de subir el proyecto a GitHub o npm.

```js
export default {
 checks: {
  paths: {
   alowed: ['./packages/**/README.nd', './packages/**/tests', './packages/**/src', './LICENSE'],
   deny: ['./packages/**/readme.nd', './packages/**/source']
  },
  validate: [
 {
 paths: ['./package.json', 'content.toml'],
 validate: async (data) => !data.description,
 },
  {
  paths: ['./.pigeonposse.yml'],
  validate: async (data, utils) => await utils.validateSchema(await import('pigeonposse-web/schema.json')), // check schema in yml file
 },
  {
  paths: ['./src-tauri/tauri.conf.json'],
  validate: async (data, utils) => await utils.validateSchema('./node_modules/@tauri-apps/cli/schema.json'),
 },
  {
  paths: ['./.vscode/extensions.json'],
  validate: async (data, utils) => {
 const extensionsSchema = z.object({
  recommendations: z.array(z.string()).refine((recommendations) => {
    const missingExtensions = [
  "davidanson.vscode-markdownlint",
  "gruntfuggly.todo-tree",
  "shd101wyy.markdown-preview-enhanced",
  "ms-playwright.playwright",
  "dbaeumer.vscode-eslint",
  "christian-kohler.npm-intellisense",
  "jacano.vscode-pnpm",
  "redhat.vscode-yaml",
  "lihui.vs-color-picker",
  "github.vscode-github-actions",
  "stylelint.vscode-stylelint"
 ].filter(ext => !recommendations.includes(ext));
    if (missingExtensions.length > 0) {
      console.log(`Faltan las siguientes extensiones recomendadas: ${missingExtensions.join(', ')}`);
      return false;
    }
    return true;
  }, {
    message: "Algunas extensiones recomendadas no están incluidas en 'recommendations'."
  })
})
 extensionsSchema.parse(data);
  },
 }
  ]
 }
}
```

## Variables compartidas (`vars`)

- [ ] mejorar sintaxis de las variables compartidas.
  - Donde se ponen los templates?
  - Como se cambian las variables?
  - Que pasa si hay templates y vars al mismo tiempo.
  - Que pasa si es un md, se cambia el frontmatter o el content o ambos?

- **json**: Comparte variables del paquete. Acepta una URL o la ruta a un archivo JSON.
- **md**: Comparte contenido de documentos Markdown y las variables de frontmatter.

```js
import {generateASCII, readJSONs} from 'dovenv/utils'
import monorepo from './package.json'

export default {
 vars: {
 get: {
  monorepo: monorepo,
  data: await import('./data.mjs'),
  pkg: await readJSONs('./packages/**/package.json'), // all repo package json
  mark: await generateASCII('dovenv', 'PIGEON\nPOSSE'),
 },
 set: [
 {
  files: ['./packages/**/README.nd'],
  template: './template/readme.js',
 }
 ]
 }
}
```

- **run**: Sobrescribe los archivos

### CLI personalizada (`custom`)

Añade comandos de terminal custom añadiendo la clave de tu cmd y la funcion a hacer

```js
export default {
 custom: {
  info: {
 desc: 'Set project information to contributors',
 fn: async (utils) => {
 if(utils.existsFlag('--devs')){
 const content = await utils.printMDFromPath('./info-developers.md')
 console.log(content)
 }else if(utils.existsFlag('--trans')){
 const content = await utils.printMDFromPath('https://github.com/pigeonposse/.github/info-translators.md')
 console.log(content)
 }
 }
  }
 }
}
```

## Separate libraries (plugins)

- un tema oficial dovenv que añade vitest, binarium, vite y playwright
