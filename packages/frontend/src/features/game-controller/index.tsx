import { useUnit } from 'effector-react'
import { BotsSetting } from './bots-settings'
import { TogglerGame } from './toggler-game'
import { PreGameSettings } from './pre-game-settings'
import { MapInfo } from './map-info'
import { MapSelection } from './map-selection'
import { $activeGame } from './model/game'
import { $selectedMap } from './model/select-map'
import './styles.scss'
import { GameSettings } from './game-settings'

export const GameController = () => {
	const { activeMap, startedGame } = useUnit({
		activeMap: $selectedMap,
		startedGame: $activeGame,
	})
	if (startedGame) {
		return (
			<div className={'game-controller'}>
				<div className={'game-controller-metrics'}>
					<GameSettings />
				</div>
				<TogglerGame />
			</div>
		)
	}
	return (
		<div className={'game-controller'}>
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
			{activeMap ? <TogglerGame /> : null}
		</div>
	)
}
