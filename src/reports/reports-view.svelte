<script>
	import { onMount, afterUpdate } from 'svelte';
	import { routerStore } from '../stores/router-store.js'
	import { tasksStore } from '../stores/tasks-store.js'
	import { timesStore, timesStoreNewTime } from '../stores/times-store.js'
	import { reportsStore, reportsStoreUpdateDate, reportsStoreBarchartData, reportsStoreSetPeriod } from '../stores/reports-store.js'

	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateGetWeek, dateGetMonth } from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiMultiselect from '../ui/ui-multiselect.svelte'
	import UiRadio from '../ui/ui-radio.svelte'
	import ReportsBarchart from '../reports/reports-barchart.svelte'
	import ReportsDistribution from '../reports/reports-distribution.svelte'

	const PERIOD_OPTIONS = [{
		title: 'Week',
		value: 'week'
	}, {
		title: 'Month',
		value: 'month'
	}/*, {
		title: 'Year',
		value: 'year'
	}*/],

	PERIOD_MAP = {
		'week': 7,
		'month': 31,
		'year': 368
	}

	let period = 'week',
		filterTasks,
		filterTasksLength = 0,
		scrollToDateFunction

	$: tasksToFilter = [...$tasksStore.array, {
		title: 'No Task',
		id: null
	}]

	onMount(() => {

	})

	afterUpdate(() => {
		if(filterTasksLength != filterTasks.length) {
			reportsStore.update(data => {
				filterTasksLength = filterTasks.length
				data.filterTasks = filterTasks
				return data
			})
		}
	})

	function getPeriodTitle(date) {
		if(period === 'week') {
			if( dateGetWeek(datePrevDate(date)) != dateGetWeek(date)) {
				return 'Week Number ' + dateGetWeek(date)
			} else {
				return dateGetHumanDate(date) +' – '+ dateGetHumanDate(dateNextDate(date, 6))
			}
		} else if(period === 'month') {
			if( (datePrevDate(date)).getMonth() != date.getMonth()) {
				return dateGetMonth(date) + ' ' + date.getFullYear()
			} else {
				return dateGetHumanDate(date) +' – '+ dateGetHumanDate(dateNextDate(date, 30))
			}
		}

		return dateGetWeek(date)
	}

	function prevPeriod(date) {
		if(period === 'week') {
			if( dateGetWeek(datePrevDate(date)) != dateGetWeek(date)) {
				var newDate = datePrevDate(date, 7)
			} else {
				while(dateGetWeek(datePrevDate(date)) === dateGetWeek(date)) {
					date = datePrevDate(date)
				}
				var newDate = date
			}
		} else if(period === 'month') {
			if( (datePrevDate(date)).getMonth() != date.getMonth()) {
				date = datePrevDate(date)
			} 

			while(datePrevDate(date).getMonth() === date.getMonth()) {
				date = datePrevDate(date)
			}
			var newDate = date
		}

		reportsStoreUpdateDate(newDate)
		scrollToDateFunction(newDate)
	}


	function nextPeriod(date) {
		if(period === 'week') {
			if( dateGetWeek(datePrevDate(date)) != dateGetWeek(date)) {
				var newDate = dateNextDate(date, 7)
			} else {
				while(dateGetWeek(datePrevDate(date)) === dateGetWeek(date)) {
					date = dateNextDate(date)
				}
				var newDate = date
			}
		} else if(period === 'month') {
			if(datePrevDate(date).getMonth() != date.getMonth()) {
				date = dateNextDate(date)
			}

			while(datePrevDate(date).getMonth() === date.getMonth()) {
				date = dateNextDate(date)
			}
			var newDate = date
		}

		reportsStoreUpdateDate(newDate)
		scrollToDateFunction(newDate)
	}

</script>

<section class="filter-header">
	<!--<div class="button-wrapper">
		<UiButton label="Team ▾" />
	</div>-->
	<div class="button-wrapper">
		<UiMultiselect
			label="Tasks"
			options={tasksToFilter}
			bind:value={filterTasks} />
	</div>
	<!--<div class="button-wrapper">
		<UiButton label="Tags ▾" />
	</div>-->
</section>

<section class="range-header">
	<div class="date-nav">
		<div class="button-wrapper">
			<UiButton 
				type="icon" 
				icon="arrow-left"
				on:click={e => prevPeriod($reportsStore.date)} />
		</div>
		<div class="button-wrapper">
			<UiButton 
				type="icon"
				icon="arrow-right"
				on:click={e => nextPeriod($reportsStore.date)} />
		</div>
		<h2>
			{getPeriodTitle($reportsStore.date)}
		</h2>
	</div>

	<div class="range-wrapper">
		<UiRadio options={PERIOD_OPTIONS} bind:value={period} on:change={e => reportsStoreSetPeriod(PERIOD_MAP[period])} />
	</div>
</section>

<section>
	<ReportsBarchart bind:scrollToDate={scrollToDateFunction} />
	<ReportsDistribution />
</section>



<style>

	section {
		display:flex;
		flex-flow: row wrap;
		max-width:960px;
		margin:24px auto 24px auto;
	}

	.filter-header .button-wrapper {
		margin-right:6px;
	}

	.range-header {
		display:flex;
		flex-direction: row wrap;
	}

	.date-nav {
		display:flex;
		flex-flow: row wrap;
		width:60%;
		font-size:0;
	}

	.button-wrapper {
		margin-right:6px;
	}

	.button-wrapper + .button-wrapper {
		margin-right:12px;
	}

	.range-wrapper {
		flex: 1;
		text-align:right;
	}

</style>