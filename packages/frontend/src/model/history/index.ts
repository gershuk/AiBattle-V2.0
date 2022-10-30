import { createEffect, createEvent, createStore, sample } from 'effector'

const $location = createStore<Location>({ ...window.location })

const $locationHostname = $location.map(location => location.hostname)
const $locationHref = $location.map(location => location.href)
const $locationHost = $location.map(location => location.host)
const $locationSearch = $location.map<{ [k: string]: string }>(location => {
	const search = location.search.substring(1)
	if (!search.length) return {}
	return JSON.parse(
		'{"' +
			decodeURI(search)
				.replace(/"/g, '\\"')
				.replace(/&/g, '","')
				.replace(/=/g, '":"') +
			'"}'
	)
})

const changeLocation = createEvent<Location>()

const changeParams = createEvent<{ [k: string]: string | number }>()
const appendParams = createEvent<{ [k: string]: string | number }>()

const changeParamsFx = createEffect(
	(query: { [k: string]: string | number }) => {
		const qs = Object.entries(query).reduce((acc, [key, value]) => {
			if (acc === '?') return `${acc}${key}=${value}`
			return `${acc}&${key}=${value}`
		}, '?')
		window.history.pushState({}, '', qs !== '?' ? qs : '')
		return { ...window.location }
	}
)

$location.on(changeLocation, (_, newLocation) => newLocation)

sample({
	source: $locationSearch,
	clock: appendParams,
	fn: (searchParams, appendParams) => ({ ...searchParams, ...appendParams }),
	target: changeParams,
})

sample({
	clock: changeParams,
	target: changeParamsFx,
})

sample({
	clock: changeParamsFx.doneData,
	target: changeLocation,
})

window.onpopstate = event => {
	changeLocation({ ...window.location })
}

const historyMethods = {
	changeParams,
	appendParams,
}

export {
	$locationHostname,
	$locationHref,
	$locationHost,
	$locationSearch,
	historyMethods,
}
