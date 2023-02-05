import { openFileExplorer, readFile } from 'api'
import { attach, createEvent, sample } from 'effector'
import {
	$dataMaps,
	$maps,
	addMap,
	readMapsFromLocalStorageFx,
	removeMap,
} from 'model'
import { addSession, removeSession } from './session'

const uploadedFile = createEvent()
const createdFile = createEvent<string>()
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

loadedMapFx.failData.watch(e => {
	if (e?.message !== 'cancel-user') alert(e)
})

export { uploadedFile, removedFileMap, createdFile }
