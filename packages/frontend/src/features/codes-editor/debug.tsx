import { SceneParameters } from '@ai-battle/engine'
import { useUnit } from 'effector-react'
import { $selectedMap } from 'features/game-controller/model'
import { htmlFormToJson } from 'libs'
import { $codesData, $dataMaps } from 'model'
import { useMemo } from 'react'
import { Button, DropDown, InputNumber } from 'ui'
import {
	$startedAutoTurn,
	CanvasComponent,
	engineMethods,
	selected,
} from './model'

interface DebugProps {
	selectedCodeName: string
}

export const Debug = ({ selectedCodeName }: DebugProps) => {
	const { startedAutoTurn, mapsHashMap, activeMap, codesHashMap } = useUnit({
		startedAutoTurn: $startedAutoTurn,
		mapsHashMap: $dataMaps,
		activeMap: $selectedMap,
		codesHashMap: $codesData,
	})

	const maps = useMemo(() => {
		return Object.values(mapsHashMap)
			.filter(x => x.valid)
			.map(({ name }) => ({ id: name, text: name }))
	}, [mapsHashMap])

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
							console.log('{ sceneParams, mapData, codesBot: [botCode] }', {
								sceneParams,
								mapData,
								codesBot: [botCode],
							})
							engineMethods.init({ sceneParams, mapData, codesBot: [botCode] })
						} else {
							engineMethods.stopAutoTurn()
						}
					}}
				>
					<div className={'setting-item'}>
						<div className={'input-title'}>Карта</div>
						<DropDown
							required
							value={activeMap?.name}
							options={maps}
							onChange={selected}
							name={'mapName'}
						/>
					</div>
					<div className={'setting-item'}>
						<div className={'input-title'}>maxTurnIndex</div>
						<InputNumber
							required
							name="sceneParams.maxTurnIndex"
							min={1}
							initValue={1000000}
						/>
					</div>
					<div className={'setting-item'}>
						<div className={'input-title'}>animTicksCount</div>
						<InputNumber
							required
							name="sceneParams.animTicksCount"
							min={1}
							initValue={60}
						/>
					</div>
					<div className={'setting-item'}>
						<div className={'input-title'}>animTicksTime</div>
						<InputNumber
							required
							name="sceneParams.animTicksTime"
							min={1}
							initValue={12}
						/>
					</div>
					<div className={'setting-item'}>
						<div className={'input-title'}>autoTurnTime</div>
						<InputNumber
							required
							name="sceneParams.autoTurnTime"
							min={1}
							initValue={1100}
						/>
					</div>
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
			<CanvasComponent className='render-debug-canvas' />
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
