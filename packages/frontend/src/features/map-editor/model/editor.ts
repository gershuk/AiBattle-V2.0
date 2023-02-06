import { combine, createEvent, createStore } from 'effector'
import { $dataMaps, isMapData, MapData } from 'model'
import { jsonIsValid } from 'libs'

const $editorTexts = createStore<{ [k: string]: string }>({})
const $mapsWithCache = combine($dataMaps, $editorTexts, (maps, editorTexts) => {
	return Object.values(maps).map(code => {
		if (code.name in editorTexts) {
			const { status: modifyJsonValid, parsedJson: parseCache } = jsonIsValid(
				editorTexts[code.name]
			)
			const modifyValidDataMap = modifyJsonValid ? isMapData(parseCache) : false
			const cacheMapData = modifyValidDataMap ? (parseCache as MapData) : null
			return {
				...code,
				cache: editorTexts[code.name],
				modified: editorTexts[code.name] !== code.content,
				modifyJsonValid,
				modifyValidDataMap,
				cacheMapData: cacheMapData,
			}
		}
		return {
			...code,
			cache: null,
			modified: false,
			modifyJsonValid: code.validJson,
			modifyValidDataMap: code.validDataMap,
			cacheMapData: code.data,
		}
	})
})

const changedMap = createEvent<{ name: string; content: string }>()

$editorTexts.on(changedMap, (cache, { name, content }) => ({
	...cache,
	[name]: content,
}))

export { changedMap, $mapsWithCache }
