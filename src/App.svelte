<script>
	import { onMount } from 'svelte';
	import { routerStore } from './stores/router-store.js'
	import { authStore, authInit } from './stores/auth-store.js'
	import { timesStoreInit } from './stores/times-store.js'
	import { tasksStoreInit } from './stores/tasks-store.js'
	import { userStoreInit } from './stores/user-store.js'
	import { teamStore, teamStoreInit } from './stores/team-store.js'
	import { reportsStoreInit } from './stores/reports-store.js'
	import { uiStore, uiStoreInit, uiStoreSetBreakpoint } from './stores/ui-store.js'
	import { getWindowWidth } from './helpers/helpers.js'

	import SignUp from './sign-in/sign-up-view.svelte'
	import SignIn from './sign-in/sign-in-view.svelte'
	import NewPasswordView from './sign-in/new-password-view.svelte'
	import AccountView from './sign-in/account-view.svelte'

	import MainNav from './ui/ui-main-nav.svelte'
	import TimelogView from './timelog/timelog-view.svelte'
	import ReportsView from './reports/reports-view.svelte'
	import SettingsView from './settings/settings-view.svelte'

	let resizing = false,
		debounceTimeout

	onMount(() => {
		authInit()
		timesStoreInit()
		tasksStoreInit()
		userStoreInit()
		teamStoreInit()
		reportsStoreInit()
		uiStoreInit()
		uiStoreSetBreakpoint(getWindowWidth())
	})

	function resize() {
		clearTimeout(debounceTimeout)
		debounceTimeout = setTimeout(() => {
			//resizing = true;
			setTimeout(() => {
				resizing = false
			}, 10)

			uiStoreSetBreakpoint(getWindowWidth())
		}, 300)
	}

const COLORS = [
  '#B33C24', '#B37D47', '#B3A147', '#A1B347', '#7DB347',
  '#68B359', '#47B359', '#47B37D', '#47B3A1', '#47A1B3',
  '#477DB3', '#4759B3', '#5947B3', '#7D47B3', '#A147B3',
  '#B359A4', '#B3477D', '#B34759', '#4D4D4D'
]

</script>

{#if !resizing}

	{#if $routerStore.view === 'account'}
		<AccountView />
	{:else if $authStore.inited && !$authStore.hasAuth}
		{#if $routerStore.view === 'sign-up'}
			<SignUp />
		{:else if $routerStore.view === 'new-password'}
			<NewPasswordView />
		{:else}
			<SignIn />
		{/if}
	{:else if $authStore.seemsToHaveAuth && $teamStore.active}
		<MainNav />

		{#if $routerStore.view === 'timelog'}
			<TimelogView />
		{:else if $routerStore.view === 'reports'}
			<ReportsView />
		{:else if $routerStore.view === 'settings'}
			<SettingsView />
		{/if}
	{/if}

{/if}

<svelte:window on:resize={e => resize()} />

<style>
/*	.loading {
		position: absolute;
		top:50%;
		left:50%;
		transform: translateX(-50%) translateY(-50%);
		font-size:60px;
		color:#EEE;
	}

.loader, .loader:before, .loader:after {
	border-radius: 50%;
	width: 12px;
	height: 12px;
	animation: load 1200ms infinite ease-in-out;
	background:transparent;
	box-shadow: 0 -12px 0 0 #999;
}
.loader {
	position: absolute;
	top:50%;
	left:50%;
	animation-delay: 200ms;
	text-indent: -9999px;
	margin:6px 0 0 -6px;
}
.loader:before,
.loader:after {
	display:block;
	content: '';
	position: absolute;
	top: 0;
}
.loader:before {
	left: -18px;
	animation-delay: 0ms;
}
.loader:after {
	left:18px;
	animation-delay: 400ms;
}

@keyframes load {
	0%,
	80%,
	100% {
		box-shadow: 0 -12px 0 0 #999;
	}
	40% {
		box-shadow: 0 -24px 0 0 #999;
	}
}*/
</style>