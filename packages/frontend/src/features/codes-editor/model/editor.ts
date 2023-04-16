import { attach, combine, createEvent, sample } from 'effector'
import {
	addCode,
	$codes,
	removeCode,
	$codesData,
	readCodesFromLocalStorageFx,
	changeCode,
	renameCode,
} from 'model'
import { createSessionsManager } from 'libs/ace-editor'
import { showConfirm, showMessage } from 'ui'
import {
	createTranslation,
	openFileExplorer,
	OpenFileExplorerError,
	readFile,
	ReadFileError,
	alertErrors,
} from 'libs'
import 'ace-builds/src-noconflict/mode-javascript'
import { config } from 'ace-builds'

config.setModuleUrl(
	'ace/mode/javascript_worker',
	'./ace-editor-resources/worker-javascript.min.js'
)

const { getTranslationItem } = createTranslation({
	ru: {
		errorConvertString: 'Невозможно преобразовать файл в строку',
		errorRead: 'Произошла ошибка при чтении файла',
		overwriteFile: 'Файл с таким именем уже существует. Перезаписать файл?',
	},
	en: {
		errorConvertString: 'Unable to convert file to string',
		errorRead: 'An error occurred while reading the file',
		overwriteFile: 'A file with the same name already exists. Overwrite file?',
	},
})

const _codeExample = `/*
Example random bot

Purpose of codes:
0 - nothing
1 - down
2 - right
3 - top
4 - left
5 - plant the bomb
*/

class Controller { 
    Init(info) {}
    
    GetRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    GetCommand(info) { 
        console.log(info);
        return { bombermanAction: this.GetRandomInt(0, 6) }
    }
    
} 
`

const errorReadStringFile = new Error('error read string from file')
const errorAbortLoadFileUser = new Error('user abort upload file')

const {
	$sessions,
	$sessionsValue,
	addSession,
	removeSession,
	resetSession,
	renameSession,
} = createSessionsManager({
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
const renamedFileCode = createEvent<{ oldName: string; newName: string }>()

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
					content: getTranslationItem('overwriteFile'),
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

sample({
	clock: renamedFileCode,
	target: [renameCode, renameSession],
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
	],
	defaultMessage: 'Произошла ошибка',
	showMessage: ({ msg }) => showMessage({ content: msg }),
})

export {
	$sessions,
	$codesModified,
	uploadedFileCode,
	removedFileCode,
	createdFileCode,
	renamedFileCode,
}
