import { useUnit } from 'effector-react'
import { $maps } from 'model'
import { DropDown } from 'ui'
import { $selectedMap, selected } from '../model/select-map'
import './styles.scss'

export const MapSelection = () => {
	const { maps, activeMap } = useUnit({
		maps: $maps,
		activeMap: $selectedMap,
	})
	return (
		<div className={'map-selection'}>
			<div className={'title'}>Карта</div>
			<div>
				<DropDown
					value={activeMap?.name}
					options={maps.map(({ name }) => ({ id: name, text: name }))}
					onChange={x => selected(x)}
				/>
			</div>
		</div>
	)
}
