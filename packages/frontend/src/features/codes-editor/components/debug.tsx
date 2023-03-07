import { SceneParameters } from '@ai-battle/engine'
import { useUnit } from 'effector-react'
import { htmlFormToJson } from 'libs'
import { $codesData, $dataMaps } from 'model'
import { useMemo } from 'preact/hooks'
import { Button, FormGenerator, AllFields, StartIcon, StopIcon } from 'ui'
import {
	$formValues,
	$startedAutoTurn,
	CanvasComponent,
	engineMethods,
	setFieldValue,
} from '../model'

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
							engineMethods.init({
								sceneParams,
								mapData,
								codesBot: mapData.spawns.map(() => botCode),
							})
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
						{startedAutoTurn ? <StopIcon /> : <StartIcon />}
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
