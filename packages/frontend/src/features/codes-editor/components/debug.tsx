import { GAME_ENGINE_TRANSLATION, SceneParams } from 'api/engine'
import { useUnit } from 'effector-react'
import { combineTranslation, createTranslation, htmlFormToJson } from 'libs'
import { $codesData, $dataMaps, changeRoute, RoutePath } from 'model'
import { useMemo } from 'preact/hooks'
import {
	Button,
	FormGenerator,
	AllFields,
	StartIcon,
	StopIcon,
	showConfirm,
} from 'ui'
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

const _formFields = [
	{
		type: 'number',
		min: 1,
		name: 'sceneParams.tileSizeScale',
		required: true,
		className: 'game-settings-range',
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.maxTurnIndex',
		min: 2,
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.animTicksCount',
		min: 1,
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.animTicksTime',
		min: 1,
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.autoTurnTime',
		min: 1,
	},
] as const

const { useTranslation } = createTranslation(
	combineTranslation(GAME_ENGINE_TRANSLATION, {
		ru: {
			map: 'Карта',
			emptyMaps: 'Карты отсутствуют, создать новую?',
		},
		en: {
			map: 'Map',
			emptyMaps: 'Cards are missing, create a new one?',
		},
	})
)

export const Debug = ({ selectedCodeName }: DebugProps) => {
	const t = useTranslation()
	const { startedAutoTurn, mapsKV, codesKV, formValues } = useUnit({
		startedAutoTurn: $startedAutoTurn,
		mapsKV: $dataMaps,
		codesKV: $codesData,
		formValues: $formValues,
	})

	const maps = useMemo(() => {
		return Object.values(mapsKV)
			.filter(x => x.valid)
			.map(({ name }) => ({ id: name, text: name }))
	}, [mapsKV])

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
					title: t('map'),
					disabled: startedAutoTurn,
					initValue: formValues['mapName'],
					onClick: async () => {
						if (!maps.length) {
							const { status } = await showConfirm({ content: t('emptyMaps') })
							if (status === 'ok') changeRoute(RoutePath.mapEditor)
						}
					},
				},
				..._formFields.map(field => ({
					...field,
					disabled: startedAutoTurn,
					onChange: (value: any) =>
						setFieldValue({ value, fieldName: field.name }),
					initValue: formValues[field.name],
					title: t(field.name),
				})),
			] as AllFields[],
		[maps, startedAutoTurn, t]
	)

	return (
		<div className={'debug-wrapper'}>
			<div className={'debug-engine-setting'}>
				<form
					onSubmit={e => {
						e.preventDefault()
						if (!startedAutoTurn) {
							const { sceneParams, mapName } = htmlFormToJson<{
								sceneParams: SceneParams
								mapName: string
							}>(e.currentTarget)
							const mapData = mapsKV[mapName].data!
							const botCode = codesKV[selectedCodeName]
							engineMethods.init({
								sceneParams,
								mapData,
								codesBot: mapData.spawns.map(() => ({
									code: botCode.content,
									nameBot: botCode.name,
								})),
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
