<script>
	import { Linter } from 'eslint'
	import { onMount }   from 'svelte'

	import Component from './comp.svelte'
	import { lint } from './lint'

	console.log( 'lint', lint, Linter, onMount, Component )

</script>

<div>

	<header>
		<h1>Bienvenido a mi página web</h1>
	</header>
	<input autocomplete="foo" checked >
	<div style="color:blue"></div>
	<img alt="" src="file.json">
	<svg viewBox="0 0 300 100"></svg>
	<div>

		<div id='containing "double" quotes'></div>
	</div>
	<slot />
</div>
