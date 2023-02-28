import { useUnit } from 'effector-react'
import { useMemo } from 'preact/hooks'
import { $selectedMap } from '../../model/select-map'
import './styles.scss'

export const MapInfo = () => {
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
			<div className={'title'}>Информация о карте</div>
			<div className={'infos-list'}>
				<div>Количество клеток - {countCell}</div>
				<div>Количество спавнов - {activeMap?.data?.spawns.length}</div>
			</div>
		</div>
	)
}
