<script>
	import { onMount }   from 'svelte'
	import { Linter } from 'eslint'
	import { lint } from './lint'
	import Component from './comp.svelte'

   console.log( 'lint', lint )

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
