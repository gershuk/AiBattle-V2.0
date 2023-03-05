import { attach, combine, createEvent, sample } from 'effector'
import {
	addCode,
	$codes,
	removeCode,
	$codesData,
	readCodesFromLocalStorageFx,
	changeCode,
} from 'model'
import {
	openFileExplorer,
	OpenFileExplorerError,
	readFile,
	ReadFileError,
} from 'api'
import { createSessionsManager } from 'libs/ace-editor'
import { alertErrors } from 'libs/failer/failer'
import { showConfirm } from 'ui'

const _codeExample = `// example random bot
class Controller { 
    Init(info) {}
    
    GetRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    GetCommand(info) { 
        console.log(info);
        return this.GetRandomInt(0, 6);
    }
    
} 

new Controller()`

const errorReadStringFile = new Error('Невозможно преобразовать файл в строку')
const errorAbortLoadFileUser = new Error('Пользователь отменил загрузку')

const { $sessions, $sessionsValue, addSession, removeSession, resetSession } =
	createSessionsManager({
		mode: 'ace/mode/javascript',
	})

//TODO: ПЛОХА бижим по всем файлам
const $codesModified = combine(
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
			let overwriteFile = false
			if (fileExits) {
				const { status } = await showConfirm({
					content: 'Файл с таким именем уже загружен. Перезаписать?',
				})
				if (status === 'cancel') return Promise.reject(errorAbortLoadFileUser)
				else overwriteFile = true
			}
			return {
				overwriteFile,
				file: {
					content,
					name: file.name,
				},
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
	filter: ({ overwriteFile }) => !overwriteFile,
	fn: ({ file }) => file,
	target: addCode,
})

sample({
	clock: loadScriptFx.doneData,
	filter: ({ overwriteFile }) => overwriteFile,
	fn: ({ file }) => file,
	target: [changeCode, resetSession],
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
	fn: (_, name) => ({ name, content: _codeExample }),
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
			guard: error => error === errorAbortLoadFileUser,
			ignore: true
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
	$codesModified,
	uploadedFileCode,
	removedFileCode,
	createdFileCode,
}
