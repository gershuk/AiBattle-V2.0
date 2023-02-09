import { createEvent, createStore } from 'effector'
import {
	jsonToBeautifulString,
	createEngine,
	generateGuid,
	stringToJson,
} from 'libs'

interface LogItem<Type extends string> {
	type: Type
}

interface LogJson extends LogItem<'json'> {
	jsonString: string
	jsonBeautifulString: string
}

interface LogString extends LogItem<'string'> {
	value: string
}

interface LogNumber extends LogItem<'number'> {
	value: number
}

interface LogOther extends LogItem<'other'> {
	value: string
}

export type AllLogItem = LogJson | LogString | LogNumber | LogOther

const anyToLog = (element: any): AllLogItem => {
	const strElement = String(element)
	if (typeof element === 'object' && element) {
		try {
			const { status, parsedJson } = stringToJson(JSON.stringify(element))
			if (status)
				return {
					type: 'json',
					jsonString: JSON.stringify(parsedJson),
					jsonBeautifulString: jsonToBeautifulString(parsedJson),
				}
		} catch (error) {
			console.error(error)
		}
	}
	if (typeof element === 'string') {
		return {
			type: 'string',
			value: strElement,
		}
	}
	if (typeof element === 'number') {
		return {
			type: 'number',
			value: element,
		}
	}
	return {
		type: 'other',
		value: strElement,
	}
}

const $logs = createStore<{ item: AllLogItem[]; guid: string }[]>([])
$logs.watch(console.log)

const pushLog = createEvent<{ content: any[]; guid?: string }>()

$logs.on(pushLog, (logs, { content, guid }) => [
	...logs,
	{ item: content.map(anyToLog), guid: guid || generateGuid() },
])

const { CanvasComponent, methods: engineMethods } = createEngine()

//@ts-ignore
window.debugBot = {
	log: (...logs: any[]) => {
		const guid = generateGuid()
		pushLog({ content: logs, guid })
		return guid
	},
}

export { CanvasComponent, $logs }
