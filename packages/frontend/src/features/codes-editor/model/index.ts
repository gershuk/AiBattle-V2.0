import { attach, combine, createEvent, createStore, sample } from 'effector'
import {
	addCode,
	$codes,
	removeCode,
	$codesData,
	readCodesFromLocalStorageFx,
} from 'model'
import {
	openFileExplorer,
	OpenFileExplorerError,
	readFile,
	ReadFileError,
} from 'api'
import { createSessionsManager } from 'libs/ace-editor'
import { alertErrors } from 'libs/failer/failer'

const errorReadStringFile = new Error('Невозможно преобразовать файл в строку')

const { $sessions, addSession, removeSession, $sessionsValue } = createSessionsManager({
	mode: 'ace/mode/javascript',
})

//TODO: ПЛОХА бижим по всем файлам
const $codesWithCache = combine(
	$codesData,
	$sessionsValue,
	(codes, sessionsValue) => {
		return Object.values(codes).map(code => ({
			...code,
			modified:
				code.name in sessionsValue && sessionsValue[code.name] !== code.content,
		}))
	}
)

const uploadedFileCode = createEvent()
const createdFileCode = createEvent<string>()
const removedFileCode = createEvent<string>()

const loadScriptFx = attach({
	source: $codes,
	effect: async codes => {
		const file = await openFileExplorer({ accept: '.js' })
		const content = await readFile(file)
		if (typeof content === 'string') {
			const fileExits = !!codes.find(code => code.name === file.name)
			//TODO: убрать запрещение загружать файл с таким файлом
			if (fileExits)
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
	clock: uploadedFileCode,
	target: loadScriptFx,
})

sample({
	clock: loadScriptFx.doneData,
	target: addCode,
})

sample({
	clock: removedFileCode,
	target: removeCode,
})

sample({
	source: $codes,
	clock: createdFileCode,
	filter: (codes, name) =>
		Boolean(name) && !codes.find(code => code.name === name),
	fn: (_, name) => ({ name, content: '' }),
	target: addCode,
})

sample({
	clock: [addCode.map(code => [code]), readCodesFromLocalStorageFx.doneData],
	fn: codes => codes.map(({ content, name }) => ({ name, value: content })),
	target: addSession,
})

sample({
	clock: removeCode,
	fn: code => code,
	target: removeSession,
})

alertErrors({
	fxs: [loadScriptFx],
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
	],
	defaultMessage: 'Произошла ошибка',
})

export {
	$sessions,
	$codesWithCache,
	uploadedFileCode,
	removedFileCode,
	createdFileCode,
}
