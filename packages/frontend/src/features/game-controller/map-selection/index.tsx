import { useUnit } from 'effector-react'
import { $dataMaps, $maps } from 'model'
import { useMemo } from 'react'
import { DropDown } from 'ui'
import { $selectedMap, selected } from '../model/select-map'
import './styles.scss'

export const MapSelection = () => {
	const { mapsHashMap, activeMap } = useUnit({
		mapsHashMap: $dataMaps,
		activeMap: $selectedMap,
	})
	const maps = useMemo(() => {
		return Object.values(mapsHashMap).filter(x => x.valid)
	}, [mapsHashMap])
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
