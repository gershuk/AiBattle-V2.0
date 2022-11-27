import { useUnit } from 'effector-react'
import { BotsSetting } from './bots-settings'
import { PreGameSettings } from './pre-game-settings'
import { MapInfo } from './map-info'
import { MapSelection } from './map-selection'
import { $activeGame, startedGame, stoppedGame } from './model/game'
import { $selectedMap } from './model/select-map'
import './styles.scss'
import { GameSettings } from './game-settings'
import { Button } from 'ui'
import { formDataToJson, SceneParams } from 'libs'

export const GameController = () => {
	const { activeMap, startedGame: startedGameFlag } = useUnit({
		activeMap: $selectedMap,
		startedGame: $activeGame,
	})
	if (startedGameFlag) {
		return (
			<div className={'game-controller'}>
				<div className={'game-controller-metrics'}>
					<GameSettings />
				</div>
				<div className={'game-controller-footer'}>
					<Button color={'danger'} onClick={stoppedGame}>
						Отменить
					</Button>
				</div>
			</div>
		)
	}
	return (
		<div className={'game-controller'}>
			<form
				className={'game-controller-start-form'}
				onSubmit={e => {
					e.preventDefault()
					const formData = new FormData(e.target as HTMLFormElement)
					///TODO: описать интерфейс выхода сабмита, добавить парсинг массивов
					const jsonValue = formDataToJson(formData)
					console.log('jsonValue', jsonValue)
					const { sceneParams: sceneParamsStr } = jsonValue
					const sceneParams = Object.entries(sceneParamsStr).reduce(
						(acc, [key, value]) => ({ ...acc, [key]: Number(value) }),
						{}
					) as SceneParams
					startedGame(sceneParams)
				}}
			>
				<div className={'game-controller-metrics'}>
					<MapSelection />
					{activeMap ? (
						<>
							<MapInfo />
							<BotsSetting />
							<PreGameSettings />
						</>
					) : null}
				</div>
				{activeMap ? (
					<div className={'game-controller-footer'}>
						<Button type="submit">Запустить</Button>
					</div>
				) : null}
			</form>
		</div>
	)
}
