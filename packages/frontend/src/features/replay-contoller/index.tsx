import { Replay } from 'model'
import { useState } from 'preact/hooks'
import { Button, RangeInput } from 'ui'
import './styles.scss'

interface ReplayControllerProps {
	replay: Replay
}

export const ReplayController = ({ replay }: ReplayControllerProps) => {
	const [autoStepEnable, setAutoStepEnable] = useState(false)
	return (
		<div className={'replay-settings'}>
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
							color={autoStepEnable ? 'warning' : 'primary'}
							onClick={() => setAutoStepEnable(!autoStepEnable)}
						>
							{autoStepEnable ? 'Остановить' : 'Запустить'}
						</Button>
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
