import { SceneParameters } from '@ai-battle/engine'
import { useUnit } from 'effector-react'
import { htmlFormToJson } from 'libs'
import { $codesData, $dataMaps } from 'model'
import { useMemo } from 'react'
import { Button, FormGenerator } from 'ui'
import { AllFields } from 'ui'
import {
	$formValues,
	$startedAutoTurn,
	CanvasComponent,
	engineMethods,
	setFieldValue,
} from './model'

interface DebugProps {
	selectedCodeName: string
}

const _formFields: AllFields[] = [
	{
		type: 'number',
		min: 1,
		name: 'sceneParams.tileSize',
		required: true,
		className: 'game-settings-range',
		title: 'Размер тайла',
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.maxTurnIndex',
		min: 1,
		title: 'maxTurnIndex',
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.animTicksCount',
		min: 1,
		title: 'animTicksCount',
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.animTicksTime',
		min: 1,
		title: 'animTicksTime',
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.autoTurnTime',
		min: 1,
		title: 'autoTurnTime',
	},
]

export const Debug = ({ selectedCodeName }: DebugProps) => {
	const { startedAutoTurn, mapsHashMap, codesHashMap, formValues } = useUnit({
		startedAutoTurn: $startedAutoTurn,
		mapsHashMap: $dataMaps,
		codesHashMap: $codesData,
		formValues: $formValues,
	})

	const maps = useMemo(() => {
		return Object.values(mapsHashMap)
			.filter(x => x.valid)
			.map(({ name }) => ({ id: name, text: name }))
	}, [mapsHashMap])

	const formFields = useMemo(
		() =>
			[
				{
					type: 'dropdown',
					options: maps,
					onChange: (value: any) =>
						setFieldValue({ value, fieldName: 'mapName' }),
					name: 'mapName',
					required: true,
					title: 'Карта',
					disabled: startedAutoTurn,
					initValue: formValues['mapName'],
				},
				..._formFields.map(field => ({
					...field,
					disabled: startedAutoTurn,
					onChange: (value: any) =>
						setFieldValue({ value, fieldName: field.name }),
					initValue: formValues[field.name],
				})),
			] as AllFields[],
		[maps, startedAutoTurn]
	)

	return (
		<div className={'debug-wrapper'}>
			<div className={'debug-engine-setting'}>
				<form
					onSubmit={e => {
						e.preventDefault()
						if (!startedAutoTurn) {
							const { sceneParams, mapName } = htmlFormToJson<{
								sceneParams: SceneParameters
								mapName: string
							}>(e.currentTarget)
							const mapData = mapsHashMap[mapName].data!
							const botCode = codesHashMap[selectedCodeName].content
							engineMethods.init({ sceneParams, mapData, codesBot: [botCode] })
						} else {
							engineMethods.stopAutoTurn()
						}
					}}
				>
					<FormGenerator
						fields={formFields}
						renderUnit={(Unit, field) => (
							<div className={'setting-item'}>
								<div className={'input-title'}>{field.title}</div>
								{Unit}
							</div>
						)}
					/>
					<Button
						type="submit"
						color={startedAutoTurn ? 'danger' : 'primary'}
						className={'submit-debug-setting'}
					>
						{startedAutoTurn ? (
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
								<rect width="256" height="256" fill="none" />
								<rect
									x="52"
									y="52"
									width="152"
									height="152"
									rx="6.9"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="24"
								/>
							</svg>
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
								<path
									stroke="none"
									d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
								/>
							</svg>
						)}
					</Button>
				</form>
			</div>
			{startedAutoTurn ? (
				<div className="debug-viewport">
					<CanvasComponent />
				</div>
			) : null}
		</div>
	)
}

// const Logs = () => {
// 	const logs = useUnit($logs)
// 	return (
// 		<div className={'logs-wrapper'}>
// 			<div>
// 				<Input />
// 			</div>
// 			<div className={'logs-list'}>
// 				{logs.map(log => (
// 					<div className={'log-item-wrapper'} key={log.guid}>
// 						{log.item.map(item => (
// 							<LogItem log={item} />
// 						))}
// 					</div>
// 				))}
// 			</div>
// 			<div>
// 				<Input />
// 			</div>
// 		</div>
// 	)
// }

// const LogItem = ({ log }: { log: AllLogItem }) => {
// 	if (log.type === 'json') {
// 		return <span>{log.jsonString}</span>
// 	}
// 	if (log.type === 'string') {
// 		return <span>{log.value}</span>
// 	}
// 	if (log.type === 'number') {
// 		return <span>{log.value}</span>
// 	}
// 	if (log.type === 'other') {
// 		return <span>{log.value}</span>
// 	}
// 	return null
// }
