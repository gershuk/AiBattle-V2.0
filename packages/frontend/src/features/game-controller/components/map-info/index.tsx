import { useUnit } from 'effector-react'
import { createTranslation } from 'libs'
import { useMemo } from 'preact/hooks'
import { $selectedMap } from '../../model/select-map'
import './styles.scss'

const { useTranslation } = createTranslation({
	ru: {
		infoMap: 'Информация о карте',
		cellCount: 'Количество клеток',
		spawnCount: 'Количество точек появлений ботов',
	},
	en: {
		infoMap: 'Map information',
		cellCount: 'Number of cells',
		spawnCount: 'Number of spawns',
	},
})

export const MapInfo = () => {
	const t = useTranslation()
	const activeMap = useUnit($selectedMap)
	const countCell = useMemo(() => {
		const countCell = (activeMap?.data?.map || []).reduce(
			(acc, arr) => acc + arr.length,
			0
		)
		return countCell
	}, [activeMap])
	return (
		<div className={'map-info'}>
			<div className={'title'}>{t('infoMap')}</div>
			<div className={'infos-list'}>
				<div>
					{t('cellCount')} - {countCell}
				</div>
				<div>
					{t('spawnCount')} - {activeMap?.data?.spawns.length}
				</div>
			</div>
		</div>
	)
}
