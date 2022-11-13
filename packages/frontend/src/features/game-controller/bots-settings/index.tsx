import { useUnit } from 'effector-react'
import { $codesData } from 'model'
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
	const { activeMap, codesData } = useUnit({
		activeMap: $selectedMap,
		codesData: $codesData,
	})

	const listCodes = useMemo(() => {
		return Object.values(codesData)
			.filter(({ valid }) => valid)
			.map(({ name }) => ({ id: name, text: name }))
	}, [codesData])

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
