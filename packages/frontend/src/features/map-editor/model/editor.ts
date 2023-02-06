import { combine, createEvent, createStore } from 'effector'
import { $dataMaps, isMapData, MapData } from 'model'
import { jsonIsValid } from 'libs'

const $cacheSave = createStore<{ [k: string]: string }>({})
const $mapsWithCache = combine($dataMaps, $cacheSave, (maps, cashed) => {
	return Object.values(maps).map(code => {
		if (code.name in cashed) {
			const { status: modifyJsonValid, parsedJson: parseCache } = jsonIsValid(
				cashed[code.name]
			)
			const modifyValidDataMap = modifyJsonValid ? isMapData(parseCache) : false
			const cacheMapData = modifyValidDataMap ? (parseCache as MapData) : null
			return {
				...code,
				cache: cashed[code.name],
				modify: cashed[code.name] !== code.content,
				modifyJsonValid,
				modifyValidDataMap,
				cacheMapData: cacheMapData,
			}
		}
		return {
			...code,
			cache: null,
			modify: false,
			modifyJsonValid: code.validJson,
			modifyValidDataMap: code.validDataMap,
			cacheMapData: code.data,
		}
	})
})

const changedMap = createEvent<{ name: string; content: string }>()

$cacheSave.on(changedMap, (cache, { name, content }) => ({
	...cache,
	[name]: content,
}))

export { changedMap, $mapsWithCache }
