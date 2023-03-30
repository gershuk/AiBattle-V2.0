import { useUnit } from 'effector-react'
import { BotsSetting } from './bots-settings'
import { GameSettings } from './game-settings'
import { MapInfo } from './map-info'
import { MapSelection } from './map-selection'
import { $activeGame, engine, startedGame, stoppedGame } from '../model/game'
import { $selectedMap } from '../model/select-map'
import './styles.scss'
import { Button, showMessage, StartIcon, StopIcon } from 'ui'
import { createTranslation, htmlFormToJson } from 'libs'
import { SubmitForm } from '../types'
import { PlayingGameInfo } from './playing-game-info'

const { useTranslation } = createTranslation({
	ru: {
		startAutoStep: 'Запустить авто шаг',
		stopAutoStep: 'Остановить авто шаг',
		nextStep: 'Сделать 1 шаг',
		minimumLimitBot: 'Для проведения игры необходимо минимум два бота',
	},
	en: {
		startAutoStep: 'Run auto step',
		stopAutoStep: 'Stop auto step',
		nextStep: 'Single step',
		minimumLimitBot: 'At least two bots are required to play the game',
	},
})

export const GameController = () => {
	const t = useTranslation()
	const {
		activeMap,
		startedGame: startedGameFlag,
		autoStep,
	} = useUnit({
		activeMap: $selectedMap,
		startedGame: $activeGame,
		autoStep: engine.gameState.$startedAutoTurn,
	})

	return (
		<div className={'game-controller'}>
			<form
				className={'game-controller-start-form'}
				onSubmit={e => {
					e.preventDefault()
					if (!startedGameFlag) {
						const jsonForm = htmlFormToJson<SubmitForm>(e.currentTarget)
						const filtersBots = (jsonForm?.bot || []).filter(
							({ controller }) => controller
						)
						if (filtersBots.length < 2) {
							showMessage({
								content: t('minimumLimitBot'),
							})
							return
						}
						startedGame(jsonForm)
					} else {
						stoppedGame()
					}
				}}
			>
				<div className={'game-controller-metrics'}>
					<MapSelection />
					{activeMap ? (
						<>
							<MapInfo />
							{!startedGameFlag ? <BotsSetting /> : <PlayingGameInfo />}
							<GameSettings />
						</>
					) : null}
				</div>
				<div className={'game-controller-footer'}>
					{startedGameFlag ? (
						<>
							<Button
								color={autoStep ? 'warning' : 'primary'}
								onClick={engine.methods.toggleAutoTurn}
							>
								{t(autoStep ? 'stopAutoStep' : 'startAutoStep')}
							</Button>
							<Button
								disabled={autoStep}
								className="full-width"
								onClick={engine.methods.doNextTurn}
							>
								{t('nextStep')}
							</Button>
						</>
					) : null}
					<Button
						className={'btn-toggle-game'}
						type={'submit'}
						color={startedGameFlag ? 'danger' : 'primary'}
						disabled={!activeMap}
					>
						{startedGameFlag ? <StopIcon /> : <StartIcon />}
					</Button>
				</div>
			</form>
		</div>
	)
}
