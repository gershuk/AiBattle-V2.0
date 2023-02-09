import {
	openFileExplorer,
	OpenFileExplorerError,
	readFile,
	ReadFileError,
} from 'api'
import { attach, createEvent, sample } from 'effector'
import { alertErrors, jsonToBeautifulString, make2dArray } from 'libs'
import {
	$dataMaps,
	$maps,
	addMap,
	changeMap,
	readMapsFromLocalStorageFx,
	removeMap,
} from 'model'
import { showConfirm } from 'ui'
import { makeMap } from '../utils'
import { addSession, removeSession, resetSession } from './session'

const errorReadStringFile = new Error('Невозможно преобразовать файл в строку')
const errorReadJson = new Error('Невалидный json')
const loadMapAborted = new Error('Пользователь отменил загрузку файла')

const uploadedFile = createEvent()
const createdFile = createEvent<{
	name: string
	rows: number
	columns: number
	fillCode: number
	borderCode: number
}>()
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
			let overwriteFile = false
			if (fileIsExits) {
				const { status } = await showConfirm({
					content: 'Файл с таким именем уже существует. Перезаписать файл?',
				})
				if (status === 'cancel') return Promise.reject(loadMapAborted)
				else overwriteFile = true
			}
			return {
				content,
				name: file.name,
				overwriteFile,
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
	filter: ({ overwriteFile }) => !overwriteFile,
	target: addMap,
})

sample({
	clock: loadMapFx.doneData,
	filter: ({ overwriteFile }) => overwriteFile,
	target: [resetSession, changeMap],
})

sample({
	clock: removedFileMap,
	target: removeMap,
})

sample({
	source: $maps,
	clock: createdFile,
	filter: (maps, { name }) => !!name && !maps.find(code => code.name === name),
	fn: (_, { name, rows, columns, fillCode, borderCode }) => ({
		name,
		content: jsonToBeautifulString({
			map: makeMap(rows, columns, fillCode, borderCode),
			spawns: [],
		}),
	}),
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
			guard: error => error === loadMapAborted,
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
