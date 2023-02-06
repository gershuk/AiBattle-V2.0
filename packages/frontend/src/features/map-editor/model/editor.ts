import { combine, createEvent, createStore } from 'effector'
import { $dataMaps, isMapData, MapData } from 'model'
import { stringToJson } from 'libs'

const $editorTexts = createStore<{ [k: string]: string }>({})
const $mapsWithCache = combine($dataMaps, $editorTexts, (maps, editorTexts) => {
	return Object.values(maps).map(code => {
		if (code.name in editorTexts) {
			const { status: modifyJsonValid, parsedJson: parseTextEditor } =
				stringToJson(editorTexts[code.name])
			const modifyValidDataMap = modifyJsonValid
				? isMapData(parseTextEditor)
				: false
			const cacheMapData = modifyValidDataMap
				? (parseTextEditor as MapData)
				: null
			return {
				...code,
				modified: editorTexts[code.name] !== code.content,
				modifyJsonValid,
				modifyValidDataMap,
				textEditorMapData: cacheMapData,
			}
		}
		return {
			...code,
			modified: false,
			modifyJsonValid: code.validJson,
			modifyValidDataMap: code.validDataMap,
			textEditorMapData: code.data,
		}
	})
})

const changedMap = createEvent<{ name: string; content: string }>()

$editorTexts.on(changedMap, (cache, { name, content }) => ({
	...cache,
	[name]: content,
}))

export { changedMap, $mapsWithCache }
