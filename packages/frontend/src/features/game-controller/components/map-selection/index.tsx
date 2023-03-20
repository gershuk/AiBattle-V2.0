import { useUnit } from 'effector-react'
import { createTranslation } from 'libs'
import { $dataMaps, changeRoute, RoutePath } from 'model'
import { useMemo } from 'preact/hooks'
import { DropDown, showConfirm } from 'ui'
import { $activeGame } from '../../model'
import { $selectedMap, selected } from '../../model/select-map'
import './styles.scss'

const { useTranslation } = createTranslation({
	ru: {
		map: 'Карта',
		emptyMaps: 'Карты отсутствуют, создать новую?',
	},
	en: {
		map: 'Map',
		emptyMaps: 'Cards are missing, create a new one?',
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
					onClick={async () => {
						if (!maps.length) {
							const res = await showConfirm({ content: t('emptyMaps') })
							if (res) changeRoute(RoutePath.mapEditor)
						}
					}}
				/>
			</div>
		</div>
	)
}
