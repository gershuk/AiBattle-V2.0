import {
	openFileExplorer,
	OpenFileExplorerError,
	readFile,
	ReadFileError,
} from 'api'
import { attach, createEvent, sample } from 'effector'
import { alertErrors } from 'libs'
import {
	$dataMaps,
	$maps,
	addMap,
	readMapsFromLocalStorageFx,
	removeMap,
} from 'model'
import { addSession, removeSession } from './session'

const errorReadStringFile = new Error('Невозможно преобразовать файл в строку')
const errorReadJson = new Error('Невалидный json')

const uploadedFile = createEvent()
const createdFile = createEvent<string>()
const removedFileMap = createEvent<string>()

const loadMapFx = attach({
	source: $dataMaps,
	effect: async maps => {
		const file = await openFileExplorer({ accept: '.json' })
		const content = await readFile(file)
		if (typeof content === 'string') {
			try {
				JSON.parse(content)
			} catch (e) {
				return Promise.reject(errorReadJson)
			}
			const fileIsExits = !!maps[file.name]
			if (fileIsExits)
				return Promise.reject(new Error('Файл с таким именем уже загружен'))
			return {
				content,
				name: file.name,
			}
		}
		return Promise.reject(errorReadStringFile)
	},
})

sample({
	clock: uploadedFile,
	target: loadMapFx,
})

sample({
	clock: loadMapFx.doneData,
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

alertErrors({
	fxs: [loadMapFx],
	errorList: [
		{
			guard: error => error instanceof OpenFileExplorerError,
			ignore: true,
		},
		{
			guard: error => error instanceof ReadFileError,
			msg: 'Произошла ошибка при чтении файла',
		},
		{
			guard: error => error === errorReadStringFile,
			msg: errorReadStringFile.message,
		},
		{
			guard: error => error === errorReadJson,
			msg: errorReadJson.message,
		},
	],
	defaultMessage: 'Произошла ошибка',
})

export { uploadedFile, removedFileMap, createdFile }
