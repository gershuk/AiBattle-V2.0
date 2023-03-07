import { useUnit } from 'effector-react'
import { createTranslation } from 'libs'
import { $dataMaps } from 'model'
import { useMemo } from 'preact/hooks'
import { DropDown } from 'ui'
import { $activeGame } from '../../model'
import { $selectedMap, selected } from '../../model/select-map'
import './styles.scss'

const { useTranslation } = createTranslation({
	ru: {
		map: 'Карта',
	},
	en: {
		map: 'Map',
	},
})

export const MapSelection = () => {
	const t = useTranslation()
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
			<div className={'title'}>{t('map')}</div>
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
