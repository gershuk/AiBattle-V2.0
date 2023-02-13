import { useUnit } from 'effector-react'
import { BotsSetting } from './bots-settings'
import { PreGameSettings } from './pre-game-settings'
import { MapInfo } from './map-info'
import { MapSelection } from './map-selection'
import { $activeGame, engine, startedGame, stoppedGame } from './model/game'
import { $selectedMap } from './model/select-map'
import './styles.scss'
import { Button } from 'ui'
import { htmlFormToJson } from 'libs'
import { SubmitForm } from './types'

export const GameController = () => {
	const {
		activeMap,
		startedGame: startedGameFlag,
		autoStep,
	} = useUnit({
		activeMap: $selectedMap,
		startedGame: $activeGame,
		autoStep: engine.$startedAutoTurn,
	})

	return (
		<div className={'game-controller'}>
			<form
				className={'game-controller-start-form'}
				onSubmit={e => {
					e.preventDefault()
					const jsonForm = htmlFormToJson<SubmitForm>(e.currentTarget)
					console.log('jsonForm', jsonForm)
					startedGame(jsonForm)
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
				<div className={'game-controller-footer'}>
					{startedGameFlag ? (
						<>
							<Button
								color={autoStep ? 'warning' : 'primary'}
								onClick={engine.methods.toggleAutoTurn}
							>
								{autoStep ? 'Остановить авто шаг' : 'Запустить авто шаг'}
							</Button>
							<Button
								className="full-width"
								onClick={engine.methods.doNextTurn}
							>
								Next шаг
							</Button>
						</>
					) : null}
					<Button
						className={'btn-toggle-game'}
						type={startedGameFlag ? 'button' : 'submit'}
						color={startedGameFlag ? 'danger' : 'primary'}
						onClick={startedGameFlag ? stoppedGame : undefined}
						disabled={!activeMap}
					>
						{startedGameFlag ? (
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
				</div>
			</form>
		</div>
	)
}
