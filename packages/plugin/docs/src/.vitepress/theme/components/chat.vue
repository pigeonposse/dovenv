<script setup>

</script>
<template>
	<!-- demo/textInput are examples of passing an object directly into a property (if this does not work refer to data values like in the history example) -->
	<!-- history is an example of passing a data object into a property -->
	<deep-chat
		id="chat-element"
		:demo="false"
		:text-input="{ placeholder: { text: 'Welcome to the demo!' } }"
		:history="[
			{
				role : 'user',
				text : 'Hey, how are you today?',
			},
			{
				role : 'ai',
				text : 'I am doing very well!',
			},
		]"
		style="border-radius: 10px; position: fixed; bottom: 0px; right: 7%; z-index: 1"
	/>
</template>

