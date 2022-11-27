import { useUnit } from 'effector-react'
import { Button, LinkButton, RangeInput } from 'ui'
import { $autoStep, setAutoStep } from '../model/game'
import './styles.scss'

export const GameSettings = () => {
	const autoStep = useUnit($autoStep)
	return (
		<div className={'game-settings'}>
			<div className={'wrapper-settings'}>
				<div className={'title'}>Управление</div>
				<div className={'setting-item'}>
					<Button className="full-width">Next шаг</Button>
				</div>
				<div className={'setting-item'}>
					<div>Auto шаг</div>
					<div className={'auto-buttons'}>
						<Button
							color={autoStep ? 'warning' : 'primary'}
							onClick={() => setAutoStep(!autoStep)}
						>
							{autoStep ? 'Остановить' : 'Запустить'}
						</Button>
						<Button>Next step with timer</Button>
					</div>
				</div>
				<div className={'setting-item'}>
					<div className={'size-tile-title'}>
						Задать размер тайла <LinkButton>или сбросить</LinkButton>
					</div>
					<RangeInput min={20} max={200} className="game-settings-range" />
				</div>
			</div>
		</div>
	)
}
