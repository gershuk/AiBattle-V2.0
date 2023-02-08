import { combine } from 'effector'
import { $dataMaps, isMapData, MapData } from 'model'
import { stringToJson } from 'libs'
import { $sessionsValue } from './session'

const $mapsWithSessionValue = combine(
	$dataMaps,
	$sessionsValue,
	(maps, sessionsValue) => {
		return Object.values(maps).map(code => {
			if (code.name in sessionsValue) {
				const sessionValue = sessionsValue[code.name]
				const { status: modifyJsonValid, parsedJson: parseTextEditor } =
					stringToJson(sessionValue)
				const modifyValidDataMap = modifyJsonValid
					? isMapData(parseTextEditor)
					: false
				const cacheMapData = modifyValidDataMap
					? (parseTextEditor as MapData)
					: null
				return {
					...code,
					modified: sessionValue !== code.content,
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
	}
)

export { $mapsWithSessionValue }
