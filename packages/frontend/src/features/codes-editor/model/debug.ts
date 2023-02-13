import { combine, createEvent, createStore, sample } from 'effector'
import { createEngine, createForm } from 'libs'
import { $dataMaps } from 'model'

// interface LogItem<Type extends string> {
// 	type: Type
// }

// interface LogJson extends LogItem<'json'> {
// 	jsonString: string
// 	jsonBeautifulString: string
// }

// interface LogString extends LogItem<'string'> {
// 	value: string
// }

// interface LogNumber extends LogItem<'number'> {
// 	value: number
// }

// interface LogOther extends LogItem<'other'> {
// 	value: string
// }

// export type AllLogItem = LogJson | LogString | LogNumber | LogOther

// const anyToLog = (element: any): AllLogItem => {
// 	const strElement = String(element)
// 	if (typeof element === 'object' && element) {
// 		try {
// 			const { status, parsedJson } = stringToJson(JSON.stringify(element))
// 			if (status)
// 				return {
// 					type: 'json',
// 					jsonString: JSON.stringify(parsedJson),
// 					jsonBeautifulString: jsonToBeautifulString(parsedJson),
// 				}
// 		} catch (error) {
// 			console.error(error)
// 		}
// 	}
// 	if (typeof element === 'string') {
// 		return {
// 			type: 'string',
// 			value: strElement,
// 		}
// 	}
// 	if (typeof element === 'number') {
// 		return {
// 			type: 'number',
// 			value: element,
// 		}
// 	}
// 	return {
// 		type: 'other',
// 		value: strElement,
// 	}
// }

// const $logs = createStore<{ item: AllLogItem[]; guid: string }[]>([])
// $logs.watch(console.log)

// const pushLog = createEvent<{ content: any[]; guid?: string }>()

// $logs.on(pushLog, (logs, { content, guid }) => [
// 	...logs,
// 	{ item: content.map(anyToLog), guid: guid || generateGuid() },
// ])

//@ts-ignore
// window.debugBot = {
// 	log: (...logs: any[]) => {
// 		const guid = generateGuid()
// 		pushLog({ content: logs, guid })
// 		return guid
// 	},
// }

const { $formValues, setFieldValue } = createForm()

const {
	CanvasComponent,
	$startedAutoTurn,
	methods: engineMethods,
} = createEngine()

const $selectedMapName = createStore<string | null>(null)

const $selectedMap = combine($dataMaps, $selectedMapName, (maps, nameMap) => {
	if (nameMap && maps[nameMap]) {
		return maps[nameMap].valid ? maps[nameMap] || null : null
	}
	return null
})

const selectedMap = createEvent<string | null>()
$selectedMapName.on(selectedMap, (_, name) => name)

sample({
	clock: engineMethods.init.done,
	target: engineMethods.start,
})

sample({
	clock: engineMethods.start.done,
	target: engineMethods.startAutoTurn,
})

export {
	CanvasComponent,
	engineMethods,
	$startedAutoTurn,
	$selectedMap,
	$formValues, 
	setFieldValue,
	selectedMap,
}
