<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { timesStoreChangeComment } from '../stores/times-store.js'

	export let id = null
	export let comment = ''

	let value = '',
		el,
		sizeTestEl,
		top = 0,
		left = 0,
		maxWidth = 100,
		width = 0,
		height = 0,
		alreadyClosed = false

	const regex = /\n/g,
	dispatch = createEventDispatcher()

	onMount(() => {

		value = comment.replace(/\n/g, '')

		const boundingRect = document.querySelector('#entry-'+ id +' .comment').getBoundingClientRect()
		top = boundingRect.top
		left = boundingRect.left - 6
		maxWidth = boundingRect.width - 42

		el.focus()
		el.select()

		setTimeout(() => sizeTestChange())
	})

	function sizeTestChange() {
		const boundingRect = sizeTestEl.getBoundingClientRect()
		width = boundingRect.width
		height = boundingRect.height

		if(regex.test(value)) {
			value = value.replace(regex, '')
		}
	}

	function keydown(e) {
		if( e.keyCode === 27) { // ESC
			alreadyClosed = true
			dispatch('close', '')
		} else if( e.keyCode === 13) { // ENTER
			save()
		}
	}

	function save() {
		if(!alreadyClosed) {
			timesStoreChangeComment(id, value)
			dispatch('close', '')
		}
	}

</script>

<div
	style="{
		'top:'+ top +'px;'+
		'left:'+ left +'px;'
	}"
	class="input-wrapper">
	<textarea
		type="text"
		bind:this={el}
		bind:value={value}
		placeholder="No comment"
		on:blur={e => save()}
		on:keydown={e => keydown(e)}
		on:input={e => sizeTestChange()}
		style="{
			'width:'+ width +'px;'+
			'height:'+ height +'px;'
		}"></textarea>
</div>

<div bind:this={sizeTestEl} class="size-test" style="{'max-width:'+ maxWidth +'px;'}">{value}</div>
<style>
	.input-wrapper {
		position: absolute;
		top:0;
		left:0;
		z-index:1010;
	}

	textarea {
		margin:0;
		border:0;
		line-height: 24px;
		padding:12px;
		font-size:14px;
		outline:none;
		min-width:108px;
		min-height:48px;
		box-shadow:0 4px 0 -2px rgba(0, 0, 0, .05),  0 3px 6px rgba(0, 0, 0, .1);
		font-weight:400;
		border-radius: 6px;
		resize: none;
		overflow:hidden;
	}

	textarea::placeholder {
		color:#99938D;
	}

	.size-test {
		display:inline-block;
		line-height: 24px;
		padding:12px;
		font-size:14px;
		font-weight:400;
		position: absolute;
		top:-1000px;
		pointer-events: none;
	}
</style>