import { Input, LinkButton, RangeInput } from 'ui'
import './styles.scss'

export const PreGameSettings = () => {
	return (
		<div className={'pre-game-settings'}>
			<div className={'title'}>Конфигурация игры</div>
			<div className={'wrapper-settings'}>
				<div className={'setting-item'}>
					<div>Название реплея</div>
					<Input />
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
