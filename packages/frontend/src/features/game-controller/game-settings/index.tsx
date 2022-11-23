import { useUnit } from 'effector-react'
import { Button, RangeInput } from 'ui'
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
					<div className={'auto-range'}>
						<RangeInput min={10} max={1000} className="game-settings-range" />
					</div>
					<div className={'auto-buttons'}>
						<Button
							color={autoStep.enable ? 'warning' : 'primary'}
							onClick={() =>
								setAutoStep({ ...autoStep, enable: !autoStep.enable })
							}
						>
							{autoStep.enable ? 'Остановить' : 'Запустить'}
						</Button>
						<Button>Next step with timer</Button>
					</div>
				</div>
				<div className={'setting-item'}>
					<div>Размер тайла</div>
					<RangeInput min={20} max={200} className="game-settings-range" />
				</div>
			</div>
		</div>
	)
}
