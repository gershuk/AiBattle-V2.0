import { useUnit } from 'effector-react'
import { $dataMaps } from 'model'
import { useMemo } from 'preact/hooks'
import { DropDown } from 'ui'
import { $activeGame } from '../../model'
import { $selectedMap, selected } from '../../model/select-map'
import './styles.scss'

export const MapSelection = () => {
	const { mapsHashMap, activeMap, startedGame } = useUnit({
		mapsHashMap: $dataMaps,
		activeMap: $selectedMap,
		startedGame: $activeGame,
	})
	const maps = useMemo(() => {
		return Object.values(mapsHashMap).filter(x => x.valid)
	}, [mapsHashMap])
	return (
		<div className={'map-selection'}>
			<div className={'title'}>Карта</div>
			<div>
				<DropDown
					disabled={startedGame}
					initValue={activeMap?.name}
					options={maps.map(({ name }) => ({ id: name, text: name }))}
					onChange={x => selected(x)}
				/>
			</div>
		</div>
	)
}
