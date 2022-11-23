import { useUnit } from 'effector-react'
import { Button } from 'ui'
import { $activeGame, toggleGame } from '../model/game'
import './styles.scss'

export const TogglerGame = () => {
	const activeGame = useUnit($activeGame)
	return (
		<div className={'game-controller-footer'}>
			<Button
				color={activeGame ? 'danger' : 'primary'}
				onClick={() => toggleGame()}
			>
				{activeGame ? 'Отменить' : 'Запустить'}
			</Button>
		</div>
	)
}
