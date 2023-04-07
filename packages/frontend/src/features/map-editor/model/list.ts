import { attach, createEvent, sample } from 'effector'
import {
	alertErrors,
	createTranslation,
	jsonToBeautifulString,
	openFileExplorer,
	OpenFileExplorerError,
	readFile,
	ReadFileError,
} from 'libs'
import {
	$dataMaps,
	$maps,
	addMap,
	changeMap,
	readMapsFromLocalStorageFx,
	removeMap,
	renameMap,
} from 'model'
import { showConfirm, showMessage } from 'ui'
import { makeMap } from '../utils'
import {
	addSession,
	removeSession,
	renameSession,
	resetSession,
} from './session'

const { getTranslationItem } = createTranslation({
	ru: {
		errorConvertString: 'Невозможно преобразовать файл в строку',
		errorRead: 'Произошла ошибка при чтении файла',
		errorJson: 'Невалидный json',
		overwriteFile: 'Файл с таким именем уже существует. Перезаписать файл?',
	},
	en: {
		errorConvertString: 'Unable to convert file to string',
		errorRead: 'An error occurred while reading the file',
		errorJson: 'Invalid json',
		overwriteFile: 'A file with the same name already exists. Overwrite file?',
	},
})

const errorReadStringFile = new Error('error read string from file')
const errorReadJson = new Error('invalid json')
const loadMapAborted = new Error('user abort upload file')

const uploadedFile = createEvent()
const createdFile = createEvent<{
	name: string
	rows: number
	columns: number
	fillCode: number
	borderCode: number
}>()
const removedFileMap = createEvent<string>()
const renameFileMap = createEvent<{ oldName: string; newName: string }>()

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
					content: getTranslationItem('overwriteFile'),
				})
				if (status === 'cancel') return Promise.reject(loadMapAborted)
				else overwriteFile = true
			}
			return {
				overwriteFile,
				file: {
					name: file.name,
					content,
				},
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
	fn: ({ file }) => file,
	target: addMap,
})

sample({
	clock: loadMapFx.doneData,
	filter: ({ overwriteFile }) => overwriteFile,
	fn: ({ file }) => file,
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

sample({ clock: renameFileMap, target: [renameMap, renameSession] })

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
			msg: () => getTranslationItem('errorRead'),
		},
		{
			guard: error => error === errorReadStringFile,
			msg: () => getTranslationItem('errorConvertString'),
		},
		{
			guard: error => error === errorReadJson,
			msg: () => getTranslationItem('errorJson'),
		},
	],
	defaultMessage: 'Произошла ошибка',
	showMessage: ({ msg }) => showMessage({ content: msg }),
})

export { uploadedFile, removedFileMap, createdFile, renameFileMap }
