import { Input, InputNumber, LinkButton, RangeInput } from 'ui'
import './styles.scss'

export const PreGameSettings = () => {
	return (
		<div className={'pre-game-settings'}>
			<div className={'title'}>Конфигурация игры</div>
			<div className={'wrapper-settings'}>
				<div className={'setting-item'}>
					<div>Название реплея</div>
					<Input required name="replay-name" />
				</div>
				<div className={'setting-item'}>
					<div className={'size-tile-title'}>
						Задать размер тайла <LinkButton>или сбросить</LinkButton>
					</div>
					<RangeInput min={20} max={200} className="game-settings-range" />
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
			</div>
		</div>
	)
}
