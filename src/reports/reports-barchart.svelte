<script>
	import { onMount } from 'svelte';
	import { routerStore } from '../stores/router-store.js'
	import { reportsStore, reportsStoreUpdateDate } from '../stores/reports-store.js'

	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateDaysBetweenDates, dateGetWeekday, dateGetDay, dateGetMonth, dateToDatabaseDate} from '../helpers/helpers.js'

	import ReportsBarchartDay from '../reports/reports-barchart-day.svelte'

	let el,
	elWidth = 960,
	firstDate = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0),
	startDate = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0),
	innerEl,
	daysArray = [],
	timeout,
	scrollLeft,
	tmp = 0

	$: daysBetween = dateDaysBetweenDates(firstDate, startDate)
	$: periodWidth = elWidth / $reportsStore.period
	$: daysArray = calculateDaysArray(startDate)

	function calculateDaysArray(startDate) {
		let dateTmp = new Date(startDate)
		dateTmp.setDate(dateTmp.getDate() - $reportsStore.period)

		let daysSince = daysBetween,
			arrayTmp = []

		for(var i = -1 * $reportsStore.period; i <= $reportsStore.period; i++) {
			arrayTmp.push({
				date: dateTmp,
				daysSince
			})

			dateTmp = dateNextDate(dateTmp)
			daysSince++
		}

		return arrayTmp
	}

	onMount(() => {

		elWidth = el.getBoundingClientRect().width
		el.scrollLeft = 500000
	})


	function timeoutFunction() {
		let dateTmp = new Date(firstDate)
		dateTmp.setDate(dateTmp.getDate() + Math.round((el.scrollLeft - 500000) / periodWidth) )
		reportsStoreUpdateDate(dateTmp)
	}


	function scroll(e) {
		let dateTmp = new Date(firstDate)
		dateTmp.setDate(dateTmp.getDate() + Math.round((el.scrollLeft - 500000) / periodWidth) )
		startDate = dateTmp

		if(timeout) {
			clearTimeout(timeout)
		}

		timeout = setTimeout(timeoutFunction, 50)
	}

	export function scrollToDate(date) {
		el.scrollLeft = Math.floor(500000 + dateDaysBetweenDates(firstDate, date) * periodWidth)
	}

</script>

<div class="barchart-wrapper" style="{
	'--chart-width:' + elWidth +'px;'+
	'--visible-items:'+ $reportsStore.period +';'
}">

<div class="legend"></div>

<div class="line" style="bottom:calc(48px + 352px)"></div>
<div class="line" style="bottom:calc(48px + 264px)"></div>
<div class="line" style="bottom:calc(48px + 176px)"></div>
<div class="line" style="bottom:calc(48px + 88px)"></div>
<div class="line line-bottom" style="bottom:calc(48px + 0)"></div>

<div
	class="barchart"
	bind:this={el}
	on:scroll={e => scroll(e)}>
	<div
		class="inner"
		bind:this={innerEl}>
		{#each daysArray as day, i (day.daysSince)}
			<div class="day-container" style="{'left:'+ (500000 + (day.daysSince - $reportsStore.period) * periodWidth) +'px'}">

				<ReportsBarchartDay date={day.date} />
			</div>
		{/each}
	</div>
</div>

</div>


<style>
	.barchart-wrapper {
		position: relative;
		width:100%;
		background:#FFF;
	}

	.barchart {
		position: relative;
		height:400px;
		width:100%;
		overflow-x:auto;
		overflow-y:show;
		scroll-snap-type: x mandatory;
		backface-visibility: hidden;
		z-index:300;
	}

	.barchart::-webkit-scrollbar {
		display: none;
	}

	.inner {
		position: relative;
		height: 100%;
		width:1000000px !important;
		backface-visibility: hidden;
	}

	.day-container {
		position:absolute;
		top:0;
		width:calc(var(--chart-width) / var(--visible-items));
		height:100%;
		scroll-snap-align: start;
		text-align: center;
		font-size:14px;
		z-index:100;
		border-bottom-right-radius: 6px;
		border-bottom-left-radius: 6px;
	}

	.day-container:hover {
		background:rgba(0, 0, 0, .1);
	}

	.day-container:hover .date small {
		opacity: 1;
	}

	.legend {
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height:48px;
		background:#FAF9F7;
	}

	.line {
		content:'';
		position: absolute;
		bottom:48px;
		left:0;
		right:0;
		height: 1px;
		background:#E6E4E1;
		z-index:200;
	}

	.line-bottom {
		background:#26231E;
	}

 	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		.line {
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}

		.line-bottom {
			background:#26231E;
		}
	}
</style>