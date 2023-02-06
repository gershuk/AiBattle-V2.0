import {
	attach,
	createEffect,
	createEvent,
	createStore,
	sample,
} from 'effector'

export interface UploadedCode {
	name: string
	content: string
}

const $codes = createStore<UploadedCode[]>([])

const $codesData = $codes.map(codes =>
	codes.reduce<{
		[k: string]: {
			name: string
			content: string
		}
	}>((acc, { name, content }) => {
		return {
			...acc,
			[name]: {
				name,
				content,
			},
		}
	}, {})
)

const addCode = createEvent<UploadedCode>()
const changeCode = createEvent<UploadedCode>()
const removeCode = createEvent<string>()

const addCodesToLocalStorageFx = attach({
	source: $codes,
	effect: codes => {
		localStorage.setItem('codes', JSON.stringify(codes))
	},
})

const readCodesFromLocalStorageFx = createEffect({
	handler: (): UploadedCode[] => {
		return JSON.parse(localStorage.getItem('codes') || '') || []
	},
})

$codes.on(addCode, (codes, newCode) => [...codes, newCode])
$codes.on(removeCode, (codes, nameRemove) =>
	codes.filter(({ name }) => name !== nameRemove)
)
$codes.on(changeCode, (codes, newCode) =>
	codes.map(code => (code.name === newCode.name ? newCode : code))
)
$codes.on(readCodesFromLocalStorageFx.doneData, (_, codes) => codes)

sample({
	clock: $codes,
	target: addCodesToLocalStorageFx,
})

export {
	$codes,
	addCode,
	removeCode,
	changeCode,
	$codesData,
	readCodesFromLocalStorageFx,
}
