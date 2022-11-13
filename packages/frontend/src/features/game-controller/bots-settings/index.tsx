import { useUnit } from 'effector-react'
import { $codes } from 'model'
import { useMemo } from 'preact/hooks'
import { DropDown, Input } from 'ui'
import { $selectedMap } from '../model/select-map'
import './styles.scss'

const colors = [
	'red',
	'black',
	'yellow',
	'grey',
	'green',
	'blue',
	'pink',
	'purple',
]

export const BotsSetting = () => {
	const { activeMap, codes } = useUnit({
		activeMap: $selectedMap,
		codes: $codes,
	})

	const listCodes = useMemo(() => {
		return codes.map(({ name }) => ({ id: name, text: name }))
	}, [codes])

	return (
		<div className={'bot-setting'}>
			<div className={'title'}>Конфигурация ботов</div>
			<div className={'bot-list'}>
				{activeMap?.data?.spawns.map((_, i) => (
					<div className={'bot-setting-item'}>
						<div className={'bot-color'} style={{ background: colors[i] }} />
						<Input
							className="bot-name"
							placeholder="Имя бота"
							value={`bot#${i}`}
						/>
						<DropDown
							className="bot-controller"
							options={listCodes}
							onChange={x => console.log(x)}
						/>
					</div>
				))}
			</div>
		</div>
	)
}
