import { DropDown, Input } from 'ui'
import './styles.scss'

export const GameController = () => {
	return (
		<div className={'game-controller'}>
			<div className={'bot-setting'}>
				<div className={'title'}>Конфигурация ботов</div>
				<div className={'bot-list'}>
					<div className={'bot-setting-item'}>
						<div className={'bot-color'} />
						<Input className="bot-name" placeholder="Имя бота" />
						<DropDown
							className="bot-controller"
							options={[
								{ id: 'kek', text: 'kek kek kek' },
								{ id: 'lol', text: 'lol lol lol' },
							]}
							onChange={x => console.log(x)}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
