import { attach, combine, createEvent, createStore, sample } from 'effector'
import {
	addMap,
	removeMap,
	$maps,
	$dataMaps,
	isMapData,
	readMapsFromLocalStorageFx,
} from 'model'
import { openFileExplorer, readFile } from 'api'
import { jsonIsValid } from 'libs'
import { createSessionsManager } from 'libs/ace-editor'

const { $sessions, addSession, removeSession } = createSessionsManager({
	mode: 'ace/mode/json',
})

const $cacheSave = createStore<{ [k: string]: string }>({})
const $mapsWithCache = combine($dataMaps, $cacheSave, (maps, cashed) => {
	return Object.values(maps).map(code => {
		if (code.name in cashed) {
			const modifyJsonValid = jsonIsValid(cashed[code.name])
			const modifyValidDataMap = modifyJsonValid
				? isMapData(JSON.parse(cashed[code.name]))
				: false
			return {
				...code,
				cache: cashed[code.name],
				modify: cashed[code.name] !== code.content,
				modifyJsonValid,
				modifyValidDataMap,
			}
		}
		return {
			...code,
			cache: null,
			modify: false,
			modifyJsonValid: code.validJson,
			modifyValidDataMap: code.validDataMap,
		}
	})
})

const uploadedFile = createEvent()
const createdFile = createEvent<string>()
const changedMap = createEvent<{ name: string; content: string }>()
const removedFileMap = createEvent<string>()

const loadedMapFx = attach({
	source: $dataMaps,
	effect: async maps => {
		const file = await openFileExplorer({ accept: '.json' })
		const content = await readFile(file)
		if (typeof content === 'string') {
			try {
				JSON.parse(content)
			} catch (e) {
				return Promise.reject(new Error('invalid json'))
			}
			const fileIsExits = !!maps[file.name]
			if (fileIsExits)
				return Promise.reject(new Error('Файл с таким именем уже загружен'))
			return {
				content,
				name: file.name,
			}
		}
		return Promise.reject(new Error('не возможно преобразовать файл в строку'))
	},
})

$cacheSave.on(changedMap, (cache, { name, content }) => ({
	...cache,
	[name]: content,
}))

sample({
	clock: uploadedFile,
	target: loadedMapFx,
})

sample({
	clock: loadedMapFx.doneData,
	target: addMap,
})

sample({
	clock: removedFileMap,
	target: removeMap,
})

sample({
	source: $maps,
	clock: createdFile,
	filter: (maps, name) => !!name && !maps.find(code => code.name === name),
	fn: (_, name) => ({ name, content: '{}' }),
	target: addMap,
})

sample({
	clock: [addMap.map(map => [map]), readMapsFromLocalStorageFx.doneData],
	fn: maps => maps.map(({ content, name }) => ({ name, value: content })),
	target: addSession,
})

sample({
	clock: removeMap,
	target: removeSession,
})

//TODO: сделать нормальные коды ошибок и их обработки
loadedMapFx.failData.watch(e => {
	if (e?.message !== 'cancel-user') alert(e)
})

export {
	uploadedFile,
	removedFileMap,
	createdFile,
	changedMap,
	$mapsWithCache,
	$sessions,
}
