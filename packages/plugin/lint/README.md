# CLI de Lint (`lint`)

- **eslint**: Ejecuta ESLint.
- **stylelint**: Ejecuta Stylelint.
- **staged**: Realiza linting de archivos staged.

```js
export default {
 staged: {
 "*.{js,cjs,mjs,jsx,ts,cts,mts,tsx,json}": "eslint"
 }
}
```
